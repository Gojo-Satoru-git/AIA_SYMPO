import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const SeatAvalContext = createContext({
  seatAval: [],
  setAllSeatAval: () => {},
  clearSeatAval: () => {},
  checkSeatAval: () => {},
});

export const SeatAvalProvider = ({ children }) => {
  const [seatAval, setSeatAval] = useState([]);

  const setAllSeatAval = (list) => {
    setSeatAval(Array.isArray(list) ? list : []);
  };

  const clearSeatAval = () => {
    setSeatAval([]);
  };

  const checkSeatAval = (item) => {
    if (!item || !item.id) return false;
    const found = seatAval.find((e) => e.id == item.id);
    return found ? found.available : false;
  };

  // ✅ Fetch availability on refresh
  useEffect(() => {
    const fetchSeatAval = async () => {
      try {
        const res = await api.get("/events/availability"); 
        setAllSeatAval(res.data.data.availability);
      } catch (err) {
        console.error("Failed to fetch seat availability:", err);
      }
    };

    fetchSeatAval();
  }, []);

  return (
    <SeatAvalContext.Provider
      value={{ seatAval, setAllSeatAval, clearSeatAval, checkSeatAval }}
    >
      {children}
    </SeatAvalContext.Provider>
  );
};

export const useSeatAval = () => {
  const context = useContext(SeatAvalContext);
  if (!context) {
    throw new Error("useSeatAval must be used inside SeatAvalProvider");
  }
  return context;
};
