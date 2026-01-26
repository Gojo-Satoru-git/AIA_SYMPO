import React, { createContext, useContext, useState } from "react";

const PurchaseContext = createContext(null);

export const PurchaseProvider = ({ children }) => {
  const [purchases, setPurchases] = useState([]);

  /**
   * Add one purchase OR multiple purchases
   * - Object → appended
   * - Array  → spread & appended
   */
  const addPurchase = (newPurchase) => {
    setPurchases((prev) => [
      ...prev,
      ...(Array.isArray(newPurchase) ? newPurchase : [newPurchase]),
    ]);
  };

  /**
   * Replace all purchases (useful after login / API fetch)
   */
  const setAllPurchases = (list) => {
    setPurchases(Array.isArray(list) ? list : []);
  };

  /**
   * Clear purchases (use on logout)
   */
  const clearPurchases = () => {
    setPurchases([]);
  };

  return (
    <PurchaseContext.Provider
      value={{
        purchases,
        addPurchase,
        setAllPurchases,
        clearPurchases,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};

/**
 * Hook to access purchases
 */
export const usePurchases = () => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error("usePurchases must be used inside PurchaseProvider");
  }
  return context;
};
