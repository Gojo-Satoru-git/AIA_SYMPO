import { useState, useEffect } from 'react';
import useCart from '../context/useCart';
import useToast from '../context/useToast';
import { useAuth } from '../context/AuthContext';
import { createPaymentOrder, verifyPaymentOrder } from '../services/payment.service';
import { trackEvent } from '../utils/analytics';

import PassPosterCard from '../components/PassCard';
import { passes } from '../data/passess';
import { usePurchases } from '../context/PurchaseContext';

const Registration = () => {
  const { cart, removeFromCart, totalPrice, clearCart, addToCart } = useCart();
  const { showToast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const [backendAmount, setBackendAmount] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentLocked, setPaymentLocked] = useState(false);

  const{ addPurchase } = usePurchases();


  const selectedPass = cart.find((item) => item.type == 'pass');

  if (authLoading) {
    return (
      <section className="min-h-screen bg-transparent text-white px-6 py-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto mb-4"></div>
          <p className="text-white/60">Loading...</p>
        </div>
      </section>
    );
  }

  // Validate cart items
  const validateCart = () => {
    if (!Array.isArray(cart) || cart.length === 0) {
      showToast("Cart is empty", "error");
      return false;
    }

    for (const item of cart) {
      if (!item.id || !item.title || item.price === undefined) {
        showToast("Invalid item in cart. Please refresh and try again.", "error");
        return false;
      }
      if (typeof item.price !== 'number' || item.price <= 0) {
        showToast(`Invalid price for ${item.title}`, "error");
        return false;
      }
    }

    return true;
  };


  // 1. Helper to load Razorpay Script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      // script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user) return showToast("Please login first", "error");
    if (!validateCart()) return;

    setPaymentLocked(true);
    setPaymentLoading(true);

    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) throw new Error("Razorpay SDK failed to load");

      // Create order
      const { data: order } = await createPaymentOrder(cart);
          
      setBackendAmount(order.amount);

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "TEKHORA'26",
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
              clearCart();


              const paymentData = verifyRes.data.data; 

              addPurchase({
                orderId: response.razorpay_payment_id,
                amount: order.amount / 100, 
                events: cart.map(item => ({ eventId: item.id, title: item.title })),
                createdAt: new Date().toISOString(),
                qrToken: verifyRes.data.qrToken || paymentData?.qrToken
              });

              showToast("Payment Successful!", "success");
            }
          } catch (err) {
            console.error("Verification error:", err);
            showToast("Verification failed. Contact support.", "error");
          }
        },
        prefill: {
          name: user.displayName || 'Participant',
          email: user.email,
        },
        theme: {
          color: '#e50914',
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', (res) => {
        showToast("Payment Failed", "error");
        console.error(res.error);
      });
      rzp.open();

    } catch (error) {
      console.error(error);
      showToast(error.message || "Payment init failed", "error");
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
        {/* ================= PASSES ================= */}
        <div className="flex flex-col gap-6">
          <p className="text-center text-white/60 text-sm">Choose a pass (optional)</p>

          <div className="grid md:grid-cols-3 gap-6">
            {passes.map((pass) => {
              const isSelected = selectedPass?.id === pass.id;

              return (
                <PassPosterCard
                  key={pass.id}
                  pass={pass}
                  selected={isSelected}
                  onToggle={() => {
                    // deselect
                    if (isSelected) {
                      removeFromCart(pass.id);
                      return;
                    }

                    // remove any existing pass
                    if (selectedPass) {
                      removeFromCart(selectedPass.id);
                    }

                    // remove covered events
                    cart.forEach((item) => {
                      if (
                        item.type !== 'pass' &&
                        (pass.includes === 'ALL' || pass.includes.includes(item.id))
                      ) {
                        removeFromCart(item.id);
                      }
                    });

                    // add new pass
                    addToCart({
                      id: pass.id,
                      title: pass.title,
                      price: pass.price,
                      type: 'pass',
                      includes: pass.includes,
                    });
                  }}
                />
              );
            })}
          </div>
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
                return (
                  <div key={item.id} className={`flex justify-between items-center bg-darkCard border border-primary/30 rounded-xl p-4 ${removingId === item.id ? 'opacity-0' : 'opacity-100'} transition-all duration-300`}>
                    <div>
                      <p className="uppercase tracking-widest text-sm font-semibold">
                        {item.title}
                      </p>
                      <p className="text-white/60 text-xs uppercase">{item.type}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-primary font-bold">₹{item.price}</span>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.title)}
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
                <p className="text-primary text-2xl tracking-widest">
                  ₹{backendAmount ? backendAmount / 100 : totalPrice}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Pay Now Button */}
                <button
                  onClick={handlePayment}
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
                  {paymentLoading ? 'Processing...' : 'Pay Now'}
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
