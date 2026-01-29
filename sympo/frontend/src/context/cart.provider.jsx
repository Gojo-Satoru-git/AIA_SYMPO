import { useEffect, useState, useContext } from 'react';
import { CartContext } from './cart.context';
import { workshopcontext } from './workshop.context';

const CART_KEY = 'sympo_cart';

const CartProvider = ({ children }) => {
  const workshopData = useContext(workshopcontext);
  const OtherEvents = Array.isArray(workshopData) ? workshopData : workshopData?.OtherEvents || [];
  const workshopIds = OtherEvents.map((e) => e.id);

  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  /* ================= PASS HELPERS ================= */

  const getActivePass = () => {
    return cart.find((item) => item.type === 'pass') || null;
  };

  const isWorkshop = (eventOrId) => {
    const id = eventOrId && eventOrId.id ? eventOrId.id : eventOrId;
    return workshopIds.includes(id);
  };

  const isEventCoveredByPass = (eventOrId) => {
    const id = eventOrId && eventOrId.id ? eventOrId.id : eventOrId;
    const pass = getActivePass();
    if (!pass) return false;
    if (isWorkshop(id)) return false;
    if (pass.includes === 'ALL') return true;
    if (Array.isArray(pass.includes)) {
      return pass.includes.includes(id);
    }

    return false;
  };

  /* ================= CART ACTIONS ================= */

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      if (exists) return prev;
      if (item.type !== 'pass' && isEventCoveredByPass(item.id)) {
        return prev;
      }
      if (item.type === 'pass') {
        const filtered = prev.filter((p) => {
          // Don't keep existing passes
          if (p.type === 'pass') return false;

          // Always keep workshops/signature events - they have no relationship to passes
          if (p.type === 'workshop' || isWorkshop(p.id)) return true;

          // For regular events: apply pass rules
          if (item.includes === 'ALL') {
            // Global pass removes all regular events
            return false;
          }

          if (Array.isArray(item.includes)) {
            // Specific pass removes only events in its includes list
            return !item.includes.includes(p.id);
          }

          return true;
        });

        return [...filtered, item];
      }

      return [...prev, item];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const checkCart = (item) => {
    return cart.some((p) => p.id === item.id);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        checkCart,
        totalPrice,
        getActivePass,
        isEventCoveredByPass,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
