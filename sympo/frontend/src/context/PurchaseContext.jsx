import React, { createContext, useContext, useState } from "react";

const PurchaseContext = createContext({
  purchases: [],
  addPurchase: () => {},
  setAllPurchases: () => {},
  clearPurchases: () => {},
});

export const PurchaseProvider = ({ children }) => {
  const [purchases, setPurchases] = useState([]);

  const addPurchase = (newPurchase) => {
    setPurchases((prev) => [
      ...prev,
      ...(Array.isArray(newPurchase) ? newPurchase : [newPurchase]),
    ]);
  };

  const setAllPurchases = (list) => {
    setPurchases(Array.isArray(list) ? list : []);
  };

  const clearPurchases = () => {
    setPurchases([]);
  };

  return (
    <PurchaseContext.Provider
      value={{ purchases, addPurchase, setAllPurchases, clearPurchases }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchases = () => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error("usePurchases must be used inside PurchaseProvider");
  }
  return context;
};
