import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';
import {passes} from '../data/passess';

const PurchaseContext = createContext({
  purchases: [],
  addPurchase: () => {},
  setAllPurchases: () => {},
  clearPurchases: () => {},
  checkPurchases: () => {},
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
      if (!order.events) return false;
      return order.events.some((event) => {

        if (event.eventId == 'pass-global' || event.eventId == 'pass-tech' || event.eventId == 'pass-nontech') {
          const pass = passes.find((p) => p.id === event.eventId);

          if (pass && pass.includes.includes(item.id)) {
            return true;
          }
          return false;
        }

        return event.eventId == item.id;
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
        const res = await api.get('/user/purchases');

        const fetchedPurchases = res.data.data.purchases;
        setPurchases(fetchedPurchases);


        let needsFetch = false;

        for (const purchase of fetchedPurchases) {
          for (const event of purchase.events || []) {
            if (event.eventId === "12" || event.eventId === "13") {
              const key = `${event.title}-teamData`;
              if (!localStorage.getItem(key)) {
                needsFetch = true;
                break;
              }
            }
          }
          if (needsFetch) break;
        }

        if (!needsFetch) return;

        const teamRes = await api.get("/user/teams");
        const teams = teamRes.data.data.teams;

        for (const purchase of fetchedPurchases) {
          for (const event of purchase.events || []) {
            if (event.eventId === "12" || event.eventId === "13") {
              const key = `${event.title}-teamData`;

              if (!localStorage.getItem(key)) {
                const teamForEvent = teams.find(
                  (team) => team.eventId === event.eventId
                );

                if (teamForEvent) {
                  localStorage.setItem(
                    key,
                    JSON.stringify(teamForEvent.teamData)
                  );
                }
              }
            }
          }
        }


      } catch (err) {
        console.error('Failed to fetch purchases:', err);
      }
    };

    fetchPurchases();
  }, [user]);

  return (
    <PurchaseContext.Provider
      value={{ purchases, addPurchase, setAllPurchases, clearPurchases, checkPurchases }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchases = () => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchases must be used inside PurchaseProvider');
  }
  return context;
};
