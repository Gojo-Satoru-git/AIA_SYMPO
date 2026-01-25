import { useState } from 'react';
import useCart from '../context/useCart';
import useToast from "../context/useToast";
import { useAuth } from '../context/AuthContext';
import { createPaymentOrder, verifyPaymentOrder } from '../services/payment.service';
import { trackEvent } from '../utils/analytics';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

const Registration = () => {
  const { cart, removeFromCart, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const { user, loading: authLoading } = useAuth();
  
  const [backendAmount, setBackendAmount] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentLocked, setPaymentLocked] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [qrVisible, setQrVisible] = useState(false);

  if(authLoading) {
    return (
      <section className="min-h-screen bg-transparent text-white px-6 py-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto mb-4"></div>
          <p className="text-white/60">Loading...</p>
        </div>
      </section>     
    );
  }

  // 1. Helper to load Razorpay Script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if(window.Razorpay){
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        console.error("Failed to load Razorpay SDK");
        resolve(false)
      };
      document.body.appendChild(script);
    });
  };

  // 3. Main Payment Function
  const handlePayment = async () => {
    // A. Check Login
    if (!user || !user.email) {
      showToast("Please login to register", "error");
      return;
    }

    if(paymentLocked) return;

    if(!Array.isArray(cart) || cart.length === 0){
      showToast("Cart is empty", "error");
      return;
    }

    setPaymentLocked(true);
    setPaymentLoading(true);

    try {
      // B. Load SDK
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        showToast("Razor service unavailable. Please try again later", "error");
        return;
      }

      // Create order
      const { data: order } = await createPaymentOrder(cart.map(item => item.id));
      
      setBackendAmount(order.amount);
      
      // D. Configure Razorpay Popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Symposium '26",
        description: "Event Registration",
        order_id: order.orderId,
        
        handler: async function (response) {
          try {
            const verifyRes = await verifyPaymentOrder({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              const token = verifyRes.data.qrToken;

              if(!token){
                showToast("QR generation failedd", "error");
                return;
              }

              const scanUrl = `${window.location.origin}/scan/${token}`;

              setQrCode(scanUrl);
              setQrVisible(true);

              showToast("Payment Successful!", "success");
              trackEvent("payment_success", {
                amount: totalPrice,
                items_count: cart.length,
                timestamp: new Date().toISOString(),
              });
              clearCart();
            }
          } catch (err) {
            console.error("Payment verification error: ", err);
            showToast("Payment verification failed. Contact support.", "error");
            trackEvent("payment_verification_failed", {
              error: err.message,
            });
          }
        },
        modal: {
          ondismiss: function () {
            showToast("Payment cancelled", "info");
            trackEvent("payment_cancelled");
          },
        },
        prefill: {
          name: user.displayName || "Participant",
          email: user.email,
        },
        theme: {
          color: "#e50914",
        },
        retry: {
          enabled: false,
        },
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        showToast("Payment failed. Please try again.", "error");
        trackEvent("payment_failed", {
          error_code: response.error.code,
          error_description: response.error.description,
        });
      });
      paymentObject.open();

    } catch (error) {
      console.error("Payment Error:", error);
      showToast(
        error.message || "Failed to initiate payment. Please try again.", 
        "error"
      );

      trackEvent("payment_error", {
        error_message: error.message,
      });
    } finally {
      setPaymentLoading(false);
      setPaymentLocked(false);
    }
  };

  const handleRemoveItem = (itemId, itemTitle) => {
    setRemovingId(itemId);
    showToast(`${itemTitle} removed from cart`, 'info');
    setTimeout(() => {
      removeFromCart(itemId);
      setRemovingId(null);
    }, 300);
  };

  return (
    <section className="min-h-screen bg-transparent text-white px-6 py-24">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <div className="text-center">
          <h2 className="text-primary text-3xl md:text-4xl tracking-widest uppercase mb-2">
            Registration
          </h2>
          <p className="text-white/60 text-sm">Review your selected events and workshops</p>
        </div>

        {cart.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-white/50 uppercase tracking-widest text-sm">
              No events selected yet
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {cart.map((item) => {
                const isRemoving = removingId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`flex justify-between items-center bg-darkCard border border-primary/30 rounded-xl p-4 shadow-stGlow ${
                      isRemoving ? 'animate-slideOutLeft' : 
                      'animate-slideInRight'}`}
                  >
                    <div>
                      <p className="uppercase tracking-widest text-sm font-semibold">{item.title}</p>
                      <p className="text-white/60 text-xs uppercase">{item.type}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-primary font-bold">₹{item.price}</span>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.title)}
                        disabled={isRemoving}
                        className="text-white/50 hover:text-primary transition disabled:opacity-50"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 bg-black/60 backdrop-blur-md border border-primary rounded-2xl p-6 shadow-stGlowStrong flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
              <div className="text-center md:text-left">
                <p className="text-white/60 text-xs uppercase tracking-widest">Total Amount</p>
                <p className="text-primary text-2xl tracking-widest">₹{backendAmount ? backendAmount / 100 : totalPrice}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Pay Now Button */}
                <button
                  onClick={handlePayment} // <--- Attached Function
                  disabled={paymentLoading || paymentLocked}
                  className="
                          px-6 py-3
                          rounded-full
                          bg-primary text-black
                          uppercase tracking-widest text-sm font-semibold
                          shadow-stGlowStrong
                          hover:scale-105
                          transition
                          disabled:opacity-50 disabled:cursor-not-allowed
                        "
                >
                  {paymentLoading ? "Processing..." : "Pay Now"}
                </button>

                {/* Pay at Desk Button */}
                <button
                  className="
                            px-6 py-3
                            rounded-full
                            border border-primary
                            text-primary
                            uppercase tracking-widest text-sm
                            hover:bg-primary hover:text-black
                            transition
                          "
                >
                  Pay at Registration Desk
                </button>
              </div>
            </div>
          </>
        )}

        {qrCode && qrVisible && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-black border-2 border-primary rounded-2xl p-8 max-w-sm w-full">
              <button
                onClick={() => setQrVisible(false)}
                className="absolute top-4 right-4 text-primary text-2xl hover:text-red-500 transition"
              >
                ✕
              </button>

              <div className="text-center">
                <h3 className="text-primary text-xl font-bold mb-4 uppercase">
                  Entry Ticket
                </h3>
                <QRCodeCanvas
                  value={qrCode}
                  size={220}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                  className="mx-auto border-2 border-primary rounded-lg p-2 bg-white"
                />
                <p className="text-white/60 mt-6 text-sm">
                  Show this QR at event entry
                </p>
                <p className="text-white/40 text-xs mt-2">
                  Save screenshot or take photo before closing
                </p>

                {/* Download QR Button */}
                <button
                  onClick={() => {
                    const canvas = document.querySelector("canvas");
                    if (!canvas) return;

                    const link = document.createElement("a");
                    link.href = canvas.toDataURL("image/png");
                    link.download = `symposium-ticket-${Date.now()}.png`;
                    link.click();
                  }}
                  className="mt-6 px-4 py-2 bg-primary text-black rounded-lg font-semibold text-sm"
                >
                  Download Ticket
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Registration;