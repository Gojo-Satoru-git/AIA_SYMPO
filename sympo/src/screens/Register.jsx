import { useState } from 'react';
import useCart from '../context/useCart';
import useToast from '../context/useToast';

const Registration = () => {
  const { cart, removeFromCart, totalPrice } = useCart();
  const { showToast } = useToast();
  const [removingId, setRemovingId] = useState(null);

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
                    className={`
                      flex justify-between items-center
                      bg-darkCard
                      border border-primary/30
                      rounded-xl
                      p-4
                      shadow-stGlow
                      ${isRemoving ? 'animate-slideOutLeft' : 'animate-slideInRight'}
                    `}
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
                        className="
                          text-white/50
                          hover:text-primary
                          transition
                        "
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/*TOtal*/}
            <div
              className="
                      mt-10
                      bg-black/60 backdrop-blur-md
                      border border-primary
                      rounded-2xl
                      p-6
                      shadow-stGlowStrong
                      flex flex-col md:flex-row
                      gap-6
                      md:items-center md:justify-between
                    "
            >
              <div className="text-center md:text-left">
                <p className="text-white/60 text-xs uppercase tracking-widest">Total Amount</p>
                <p className="text-primary text-2xl tracking-widest">₹{totalPrice}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/*paynow*/}
                <button
                  className="
                          px-6 py-3
                          rounded-full
                          bg-primary text-black
                          uppercase tracking-widest text-sm font-semibold
                          shadow-stGlowStrong
                          hover:scale-105
                          transition
                        "
                >
                  Pay Now
                </button>

                {/* pay at desk*/}
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
