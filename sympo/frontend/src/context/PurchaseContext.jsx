import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const PurchaseContext = createContext({
  purchases: [],
  addPurchase: () => {},
  setAllPurchases: () => {},
  clearPurchases: () => {},
  checkPurchases : () => {},
});

export const PurchaseProvider = ({ children }) => {
  const [purchases, setPurchases] = useState([]);
  const { user } = useAuth(); // get the logged-in user

  const addPurchase = (newPurchase) => {
    setPurchases((prev) => [
      ...(Array.isArray(newPurchase) ? newPurchase : [newPurchase]),
      ...prev,
    ]);
  };

  const checkPurchases = (item) => {
    if (!item || !item.id) return false;
    const exists = purchases.some((order) => {
      return order.events.some((event) => {
        event.eventId == item.id;
      });
    });
    return exists ? true : false;
  };

  const setAllPurchases = (list) => {
    setPurchases(Array.isArray(list) ? list : []);
  };

  const clearPurchases = () => {
    setPurchases([]);
  };

  // ✅ Fetch purchases on every refresh/login
  useEffect(() => {
    if (!user) {
      setAllPurchases([]);
      return;
    }

    const fetchPurchases = async () => {
      try {
        const res = await api.get("/user/purchases");
        setAllPurchases(res.data.data.purchases);
      } catch (err) {
        console.error("Failed to fetch purchases:", err);
      }
    };

    fetchPurchases();
  }, [user]);

  return (
    <PurchaseContext.Provider
      value={{ purchases, addPurchase, setAllPurchases, clearPurchases ,checkPurchases }}
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
