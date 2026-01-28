import { useEffect, useState } from 'react';
import { CartContext } from './cart.context';

const CART_KEY = 'sympo_cart';

const CartProvider = ({ children }) => {
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
    return cart.find(item => item.type === 'pass') || null;
  };

  const isEventCoveredByPass = (eventId) => {
    const pass = getActivePass();
    if (!pass) return false;

    if (pass.includes === 'ALL') return true;
    if (Array.isArray(pass.includes)) {
      return pass.includes.includes(eventId);
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
        const filtered = prev.filter(p => {
          if (p.type === 'pass') return false;

          if (item.includes === 'ALL') return false;
          if (Array.isArray(item.includes)) {
            return !item.includes.includes(p.id);
          }
          return true;
        });

        return [...filtered, item];
      }

      return [...prev, item];
    });
  };

  const checkCart = (item) => {
    return cart.some((p) => p.id === item.id);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

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
