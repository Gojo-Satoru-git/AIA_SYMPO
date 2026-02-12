import { useState, useEffect } from 'react';
import useCart from '../context/useCart';
import useToast from '../context/useToast';
import { useAuth } from '../context/AuthContext';
import { createPaymentOrder, verifyPaymentOrder } from '../services/payment.service';
import { trackEvent } from '../utils/analytics';
import { QRCodeCanvas } from 'qrcode.react';
import PassPosterCard from '../components/PassCard';
import { passes } from '../data/passess';
import { usePurchases } from '../context/PurchaseContext';
import api from '../services/api';
import PassSuggestionModal from '../components/PassSuggestionModal';
import TosButton from '../components/TosButton';
import { load } from '@cashfreepayments/cashfree-js';

const Registration = ({ RegisterRef }) => {
  const { cart, removeFromCart, totalPrice, clearCart, addToCart } = useCart();
  const { showToast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const [backendAmount, setBackendAmount] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentLocked, setPaymentLocked] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [qrVisible, setQrVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { addPurchase, checkPassPurchases } = usePurchases();

  const [showPassPopup, setShowPassPopup] = useState(false);
  const [passSuggestion, setPassSuggestion] = useState(null);

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [totalOldAmount, setTotalOldAmount] = useState(null);
  const [firestoreOrderId, setFirestoreOrderId] = useState(null);

  const selectedPass = cart.find((item) => item.type == 'pass');

  useEffect(() => {
    setBackendAmount(null);
    setTotalOldAmount(null);
    setPromoApplied(false);
    setPromoCode('');
  }, [cart]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectedOrderId = params.get('order_id');

    if (redirectedOrderId) {
      // Short delay to ensure webhook processed the payment
      setPaymentLoading(true);
      setPaymentLocked(true);
      const timeout = setTimeout(() => {
        verifyPaymentOrder(redirectedOrderId, cart)
          .then((res) => {
            if (res.qrToken) {
              const purchase = {
                orderId: firestoreOrderId,
                amount: res.amount,
                events: res.items,
                qrToken: res.qrToken,
              };

              addPurchase(purchase);
              setQrCode(res.qrToken);
              setQrVisible(true);
              // ✅ Clear promo code after successful payment
              setPromoCode('');
              setPromoApplied(false);
              setBackendAmount(null);
              setTotalOldAmount(null);
              clearCart();
              showToast('Payment successful!', 'success');
              setErrorMsg('');
            } else {
              showToast('Payment completed but QR not generated', 'warning');
              setErrorMsg('Payment completed but QR not generated. Please contact support.');
            }
          })
          .catch((err) => {
            const msg = err?.response?.data?.message || 'Payment verification failed';
            showToast(msg, 'error');
            console.error('Verification error:', err);
            setErrorMsg(msg);
            // ✅ Clear promo code after failed payment
            setPromoCode('');
            setPromoApplied(false);
            setBackendAmount(null);
            setTotalOldAmount(null);
          })
          .finally(() => {
            setPaymentLoading(false);
            setPaymentLocked(false);
            try {
              localStorage.removeItem('lastFirestoreOrderId');
            } catch (e) {}
            window.history.replaceState({}, document.title, window.location.pathname);
          });
      }, 1000); // Give webhook 1 second to process

      return () => clearTimeout(timeout);
    }

    // Fallback: No redirect param, but we may have a persisted last firestore id
    const lastFS = localStorage.getItem('lastFirestoreOrderId');
    if (lastFS) {
      setPaymentLoading(true);
      setPaymentLocked(true);
      // Try to verify using firestore id (useful when redirect did not provide order_id)
      verifyPaymentOrder(lastFS, [])
        .then((res) => {
          if (res.qrToken) {
            const purchase = {
              orderId: firestoreOrderId,
              amount: res.amount,
              events: res.items,
              qrToken: res.qrToken,
            };

            addPurchase(purchase);
            setQrCode(res.qrToken);
            setQrVisible(true);
            // ✅ Clear promo code after successful payment
            setPromoCode('');
            setPromoApplied(false);
            setBackendAmount(null);
            setTotalOldAmount(null);
            clearCart();
            showToast('Payment successful!', 'success');
            setErrorMsg('');
            try {
              localStorage.removeItem('lastFirestoreOrderId');
            } catch (e) {}
          }
        })
        .catch((err) => {
          // Ignore fallback errors - might not be processed yet
          console.warn('Fallback verification failed', err);
        })
        .finally(() => {
          setPaymentLoading(false);
          setPaymentLocked(false);
        });
    }
  }, []);

  if (authLoading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-transparent px-6 py-24 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-t-2 border-primary"></div>
          <p className="text-white/60">Loading...</p>
        </div>
      </section>
    );
  }

  // Validate cart items
  const validateCart = () => {
    if (!Array.isArray(cart) || cart.length === 0) {
      showToast('Cart is empty', 'error');
      return false;
    }

    for (const item of cart) {
      if (!item.id || !item.title || item.price === undefined) {
        showToast('Invalid item in cart. Please refresh and try again.', 'error');
        return false;
      }
      if (typeof item.price !== 'number' || item.price <= 0) {
        showToast(`Invalid price for ${item.title}`, 'error');
        return false;
      }
    }

    return true;
  };

  const proceedToPayment = async () => {
    if (!user) return showToast('Please login first', 'error');
    if (!validateCart()) return;

    setPaymentLocked(true);
    setPaymentLoading(true);

    let currentFirestoreOrderId = null;

    try {
      const paymentData = await createPaymentOrder(cart, promoCode);
      const { firestoreOrderId, paymentSessionId, totalAmount } = paymentData;

      currentFirestoreOrderId = firestoreOrderId;
      setFirestoreOrderId(firestoreOrderId);
      localStorage.setItem('lastFirestoreOrderId', firestoreOrderId);

      const cashfree = await load({
        mode: 'production',
      });

      const checkoutOptions = {
        paymentSessionId,
        redirectTarget: '_modal',

        onClose: async () => {
          console.log('Payment popup closed by user');
          setPaymentLocked(false);
          setPaymentLoading(false);

          // Cancel the order and release seats with USER_DROPPED status
          try {
            await api.post('/payment/cancel-abandoned', {
              orderId: firestoreOrderId,
              status: 'USER_DROPPED', // ✅ Specify status
            });
            showToast('Payment cancelled. Seats released.', 'info');
            // ✅ Clear promo code when user closes payment modal
            setPromoCode('');
            setPromoApplied(false);
            setBackendAmount(null);
            setTotalOldAmount(null);
          } catch (err) {
            console.error('Failed to cancel order:', err);
          } finally {
            localStorage.removeItem('lastFirestoreOrderId');
          }
        },
      };

      await cashfree.checkout(checkoutOptions);

      const verified = await verifyPaymentOrder(firestoreOrderId, cart);

      if (verified.qrToken) {
        const purchase = {
          orderId: firestoreOrderId,
          amount: verified.amount,
          events: verified.items,
          qrToken: verified.qrToken,
        };

        addPurchase(purchase);

        setQrCode(verified.qrToken);
        setQrVisible(true);
        clearCart();
        // ✅ Clear promo code after successful payment
        setPromoCode('');
        setPromoApplied(false);
        setBackendAmount(null);
        setTotalOldAmount(null);
        showToast('Payment successful!', 'success');
        setErrorMsg('');
        setPaymentLocked(false);
        setPaymentLoading(false);
        try {
          localStorage.removeItem('lastFirestoreOrderId');
        } catch (e) {}
      }
    } catch (err) {
      // Handle payment error - cancel order if it was created
      if (currentFirestoreOrderId) {
        try {
          await api.post('/payment/cancel-abandoned', {
            orderId: currentFirestoreOrderId,
            status: 'USER_QUIT', // ✅ Use FAILED status for errors
          });
          console.log('Order cancelled due to payment error');
        } catch (cancelErr) {
          console.error('Failed to cancel order after error:', cancelErr);
        } finally {
          setPaymentLocked(false);
          setPaymentLoading(false);
          // ✅ Clear promo code after payment error
          setPromoCode('');
          setPromoApplied(false);
          setBackendAmount(null);
          setTotalOldAmount(null);
          try {
            localStorage.removeItem('lastFirestoreOrderId');
          } catch (e) {}
        }
      } else {
        // No order was created, just unlock
        setPaymentLocked(false);
        setPaymentLoading(false);
        // ✅ Clear promo code
        setPromoCode('');
        setPromoApplied(false);
        setBackendAmount(null);
        setTotalOldAmount(null);
      }

      const msg = err?.response?.data?.message || 'Payment failed';
      showToast(msg, 'error');
      console.error('Payment error:', err);
    }
  };

  const analyzeCart = (cart) => {
    let techCount = 0;
    let nonTechCount = 0;
    let techAmount = 0;
    let nonTechAmount = 0;
    let activePass = null;

    cart.forEach((item) => {
      if (item.type === 'pass') {
        activePass = item.id;
        return;
      }

      if (passes[0].includes.includes(item.id)) {
        techCount++;
        techAmount += item.price;
      }

      if (passes[2].includes.includes(item.id)) {
        nonTechCount++;
        nonTechAmount += item.price;
      }
    });

    return { techCount, nonTechCount, techAmount, nonTechAmount, activePass };
  };

  const getRecommendation = (data) => {
    const { techCount, nonTechCount, techAmount, nonTechAmount, activePass } = data;

    // If user already purchased a pass → no recommendation
    if (passes.some((p) => checkPassPurchases(p))) return null;

    // Upgrade case → Global Pass
    if (
      (activePass === passes[0].id && nonTechCount >= 2) ||
      (activePass === passes[2].id && techCount >= 2)
    ) {
      return {
        passId: passes[1].id,
        title: passes[1].title,
        price: passes[1].price,
        includes: passes[1].includes,
        message: `You already selected a pass and added events from the other category.
Global Pass at ₹${passes[1].price} covers EVERYTHING and saves money.`,
      };
    }

    // Normal suggestions
    if (techCount >= 2 && nonTechCount >= 2) {
      return {
        passId: passes[1].id,
        title: passes[1].title,
        price: passes[1].price,
        includes: passes[1].includes,
        message: `You added ${techCount} Technical and ${nonTechCount} Non-Technical events.
Global Pass at ₹${passes[1].price} gives access to ALL events and saves money.`,
      };
    }

    if (techCount >= 2 && !activePass) {
      return {
        passId: passes[0].id,
        title: passes[0].title,
        price: passes[0].price,
        includes: passes[0].includes,
        message: `You added ${techCount} Technical events (₹${techAmount}).
Tech Pass at ₹${passes[0].price} gives access to ALL Tech events and saves money.`,
      };
    }

    if (nonTechCount >= 2 && !activePass) {
      return {
        passId: passes[2].id,
        title: passes[2].title,
        price: passes[2].price,
        includes: passes[2].includes,
        message: `You added ${nonTechCount} Non-Technical events (₹${nonTechAmount}).
Non-Tech Pass at ₹${passes[2].price} gives access to ALL Non-Tech events and saves money.`,
      };
    }

    return null;
  };

  const handlePayment = async () => {
    if (!user) return showToast('Please sign in first', 'error');
    if (!validateCart()) return;

    const analysis = analyzeCart(cart);
    const recommendation = getRecommendation(analysis);

    if (recommendation) {
      setPassSuggestion(recommendation);
      setShowPassPopup(true);
      return;
    }

    proceedToPayment();
  };

  const handleRemoveItem = (itemId, itemTitle) => {
    setRemovingId(itemId);
    showToast(`${itemTitle} removed from Registration`, 'info');
    setTimeout(() => {
      removeFromCart(itemId);
      setRemovingId(null);
    }, 300);
  };

  return (
    <section className="min-h-screen bg-transparent px-6 py-24 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-12">
        <div className="text-center">
          <h2 className="mb-2 text-3xl uppercase tracking-widest text-primary md:text-4xl">
            Registration
          </h2>
        </div>
        {/* ================= PASSES ================= */}
        <div className="flex flex-col gap-6">
          <p className="text-center text-xl uppercase text-primary">Passes</p>
          <div className="grid gap-6 md:grid-cols-3">
            {passes.map((pass) => {
              const isSelected = selectedPass?.id === pass.id;
              const alreadyPurchased = checkPassPurchases(pass);

              return (
                <PassPosterCard
                  key={pass.id}
                  pass={pass}
                  selected={isSelected}
                  disabled={alreadyPurchased}
                  onToggle={() => {
                    // 🔒 If user already purchased THIS pass
                    if (checkPassPurchases(pass)) {
                      showToast('You already purchased this pass', 'info');
                      return;
                    }

                    // 🔒 If user purchased ANY pass → block switching
                    const alreadyOwnsAnyPass = passes.some((p) => checkPassPurchases(p));
                    if (alreadyOwnsAnyPass) {
                      showToast('You have already purchased a pass', 'error');
                      return;
                    }

                    // ✅ If clicking same pass → remove
                    if (selectedPass?.id === pass.id) {
                      removeFromCart(pass.id);
                      showToast(`${pass.title} removed`, 'info');
                      return;
                    }

                    // ⭐ SWITCH PASS (AUTO REPLACE)

                    // Remove existing pass if any
                    if (selectedPass) {
                      removeFromCart(selectedPass.id);
                    }

                    // Remove covered events
                    cart.forEach((item) => {
                      if (
                        item.type !== 'pass' &&
                        (pass.includes === 'ALL' || pass.includes.includes(item.id))
                      ) {
                        removeFromCart(item.id);
                      }
                    });

                    // Add new pass
                    addToCart({
                      id: pass.id,
                      title: pass.title,
                      price: pass.price,
                      type: 'pass',
                      includes: pass.includes,
                    });

                    showToast(`${pass.title} applied , Check the Registration`, 'success');
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Anchor for navigating to the registration review (right below Passes) */}
        <div ref={RegisterRef} />

        {cart.length === 0 ? (
          <div className="mt-20 text-center">
            <p className="mb-10 self-center text-center text-sm text-primary">
              Review your selected events , workshops and passes
            </p>
            <p className="mb-5 text-sm uppercase tracking-widest text-white/50">
              No item selected yet
            </p>
          </div>
        ) : (
          <div>
            <p className="mb-10 self-center text-center text-sm text-primary">
              Review your selected events , workshops and passes
            </p>
            <div className="flex flex-col gap-4">
              {cart.map((item) => {
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between rounded-xl border border-primary/30 bg-darkCard p-4 ${removingId === item.id ? 'opacity-0' : 'opacity-100'} transition-all duration-300`}
                  >
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-widest">
                        {item.title}
                      </p>
                      <p className="text-xs uppercase text-white/60">{item.type}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-bold text-primary">₹{item.price}</span>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.title)}
                        className="text-white/50 transition hover:text-primary disabled:opacity-50"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col gap-6 rounded-2xl border border-primary bg-black/60 p-6 shadow-stGlowStrong backdrop-blur-md md:flex-row md:items-center md:justify-between">
              <div className="text-center md:text-left">
                <p className="text-xs uppercase tracking-widest text-white/60">Total Amount</p>
                <div className="flex flex-col">
                  {totalOldAmount && (
                    <span className="text-sm text-white/50 line-through">₹{totalOldAmount}</span>
                  )}
                  <span className="text-2xl tracking-widest text-primary">
                    ₹{backendAmount ?? totalPrice}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 sm:flex-row">
                {/* Promo Code Box */}
                <div className="flex overflow-hidden rounded-full border border-primary bg-black/70">
                  <input
                    type="text"
                    value={promoCode}
                    disabled={promoApplied}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="PROMO CODE"
                    className="w-40 bg-transparent px-4 py-2 text-xs uppercase tracking-widest text-white outline-none"
                  />
                  <button
                    disabled={promoApplied}
                    onClick={async () => {
                      if (!promoCode) return showToast('Enter promo code', 'error');

                      const cartItems = cart.map((item) => ({
                        eventId: String(item.id),
                        quantity: 1,
                      }));

                      try {
                        const res = await api.post('/promo/preview', {
                          code: promoCode.toUpperCase(),
                          items: cartItems,
                        });

                        const { totalAmount, totalOldAmount, isPromoApplied } = res.data.data;

                        // Store the actual amount from backend (already calculated with discount)
                        setBackendAmount(totalAmount);
                        setTotalOldAmount(totalOldAmount);
                        setPromoApplied(isPromoApplied);
                        showToast('Promo applied!', 'success');
                      } catch (err) {
                        const msg = err.response?.data?.message || 'Invalid promo code';
                        showToast(msg, 'error');
                        console.error('Promo error:', err);
                      }
                    }}
                    className="bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-black"
                  >
                    {promoApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>

                {/* Pay Button */}
                {errorMsg && (
                  <div className="mb-3 rounded-md bg-red-900/40 px-4 py-2 text-sm font-medium text-red-200">
                    {errorMsg}
                  </div>
                )}
                <button
                  onClick={handlePayment}
                  disabled={paymentLoading || paymentLocked}
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-widest text-black shadow-stGlowStrong transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {paymentLoading ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Current QR Code Modal */}
        {qrCode && qrVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-sm rounded-2xl border-2 border-primary bg-black p-8">
              <button
                onClick={() => setQrVisible(false)}
                className="absolute right-4 top-4 text-2xl text-primary transition hover:text-red-500"
              >
                ✕
              </button>

              <div className="text-center">
                <h3 className="mb-4 text-xl font-bold uppercase text-primary">Entry Ticket</h3>
                <QRCodeCanvas
                  value={qrCode}
                  size={220}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                  className="mx-auto rounded-lg border-2 border-primary bg-white p-2"
                />
                <p className="mt-6 text-sm text-white/60">Show this QR at event entry</p>
                <p className="mt-2 text-xs text-white/40">
                  You Can also find this QR in your purchases section.
                </p>

                {/* Download QR Button */}
                <button
                  onClick={() => {
                    const canvas = document.querySelector('canvas');
                    if (!canvas) return;

                    const link = document.createElement('a');
                    link.href = canvas.toDataURL('image/png');
                    link.download = `symposium-ticket-${Date.now()}.png`;
                    link.click();
                  }}
                  className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black"
                >
                  Download Ticket
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pass Suggestion Modal */}
        {showPassPopup && passSuggestion && (
          <PassSuggestionModal
            open={showPassPopup}
            suggestion={passSuggestion}
            onClose={() => {
              setShowPassPopup(false);
              proceedToPayment();
            }}
            onAccept={() => {
              if (selectedPass) {
                removeFromCart(selectedPass.id);
              }
              addToCart({
                id: passSuggestion.passId,
                title: passSuggestion.title,
                price: passSuggestion.price,
                type: 'pass',
                includes: passSuggestion.includes,
              });
              setShowPassPopup(false);
            }}
          />
        )}
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <a
          href="https://forms.gle/Tn1dEaLDios2iGaF6"
          target="_blank"
          rel="noreferrer"
          className="group mt-10 flex items-center gap-4 rounded-full border border-primary px-6 py-3 transition-all duration-300 hover:bg-primary/10 hover:shadow-stGlowStrong"
        >
          <div className="animated-border flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
            <img src="./assets/form.png" alt="Instagram" className="h-6 w-6" />
          </div>

          <span className="text-sm uppercase tracking-widest">Accommodation Form</span>
        </a>
        <TosButton />
      </div>
    </section>
  );
};

export default Registration;