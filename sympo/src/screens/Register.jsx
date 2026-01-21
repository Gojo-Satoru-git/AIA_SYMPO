import { useState } from 'react';
import useCart from '../context/useCart';
import useToast from '../context/useToast';
import { useAuth } from '../context/AuthContext';
import { createPaymentOrder, verifyPaymentOrder } from '../services/payment.service';

const Registration = () => {
  const { cart, removeFromCart, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const currentUser = user;
  
  const [removingId, setRemovingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Helper to load Razorpay Script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 2. Main Payment Function
  const handlePayment = async () => {
    // A. Check Login
    if (!currentUser) {
      showToast("Please login to register", "error");
      return;
    }

    setLoading(true);

    try {
      // B. Load SDK
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        showToast("Razorpay SDK failed to load", "error");
        setLoading(false);
        return;
      }

      // C. Get Security Token
      const token = await currentUser.getIdToken();
      
      
      if(totalPrice === 0){
        showToast("Registration Successful. ", "success");
        clearCart();
        setLoading(false);
        return;
      }

      // D. Create Order on Backend (Sending Token)
      const amountToPay = totalPrice > 0 ? totalPrice : 1;
      const { data: order } = await createPaymentOrder(amountToPay, cart, token);

      // E. Configure Razorpay Popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Symposium '26",
        description: "Event Registration",
        order_id: order.id,
        handler: async function (response) {
          try {
            // F. Verify Payment on Backend (Sending Token)
            const verifyRes = await verifyPaymentOrder({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, token);

            if (verifyRes.data.success) {
              showToast("Payment Successful!", "success");
              clearCart();
            }
          } catch (err) {
            console.error(err);
            showToast("Payment verification failed", "error");
          }
        },
        prefill: {
          name: currentUser.displayName || "Participant",
          email: currentUser.email,
        },
        theme: {
          color: "#e50914",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error("Payment Error:", error);
      showToast("Payment initiation failed", "error");
    } finally {
      setLoading(false);
    }
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
                    className={`flex justify-between items-center bg-darkCard border border-primary/30 rounded-xl p-4 shadow-stGlow ${isRemoving ? 'animate-slideOutLeft' : 'animate-slideInRight'}`}
                  >
                    <div>
                      <p className="uppercase tracking-widest text-sm">{item.title}</p>
                      <p className="text-white/60 text-xs uppercase">{item.type}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-primary">₹{item.price}</span>
                      <button
                        onClick={() => {
                          setRemovingId(item.id);
                          showToast(`${item.title} removed from cart`, 'remove');
                          setTimeout(() => {
                            removeFromCart(item.id);
                            setRemovingId(null);
                          }, 300);
                        }}
                        className="text-white/50 hover:text-primary transition"
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
                <p className="text-primary text-2xl tracking-widest">₹{totalPrice}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Pay Now Button */}
                <button
                  onClick={handlePayment} // <--- Attached Function
                  disabled={loading} // <--- Disable while loading
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
                  {loading ? "Processing..." : "Pay Now"}
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
      </div>
    </section>
  );
};

export default Registration;