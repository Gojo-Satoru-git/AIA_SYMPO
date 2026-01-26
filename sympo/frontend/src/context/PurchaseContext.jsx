import React, { createContext, useContext, useState } from "react";

const PurchaseContext = createContext();

export const PurchaseProvider = ({ children }) => {
  const [purchases, setPurchases] = useState([
    {
      orderId: "order_S8NtPnqmi4gc6n",
      amount: 2,
      events: [
        { id: "8", title: "Connextions", price: 1, used: false },
        { id: "1", title: "Tournament of strategies", price: 1, used: false },
      ],
      createdAt: { _seconds: 1769403689 },
      qrToken:
        "4b4be3e46f3dc98bd750eefed106c1aa4cf6f613800ae2babc7c06c3603da635",
    },
    {
      orderId: "order_S8NoJlJ3io4Caj",
      amount: 1,
      events: [
        { id: "3", title: "Call Of Query", price: 1, used: false },
      ],
      createdAt: { _seconds: 1769403399 },
      qrToken:
        "ee96886ee919ad0b722f65dfec2e0d5a4f48659147eed60beb81894dd0477d18",
    },
  ]);

  const addPurchase = (purchase) => {
    setPurchases((prev) => [...prev, purchase]);
  };

  return (
    <PurchaseContext.Provider value={{ purchases, addPurchase }}>
      {children}
    </PurchaseContext.Provider>
  );
};

// ✅ Only ONE named export hook
export const usePurchases = () => {
  return useContext(PurchaseContext);
};
