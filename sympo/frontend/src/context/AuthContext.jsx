import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import api from "../services/api";
import useToast from "../context/useToast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setRole(res.data.role);
      return res.data;
    } catch (err) {
      console.warn("Manual profile fetch failed:", err);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        const token = await user.getIdToken();
        localStorage.setItem("authToken", token);

        try {
          const res = await api.get("/auth/profile");
          setRole(res.data.role);
        } catch (err) {
          if (err.response && err.response.status === 404) {
            console.log("User not found in DB yet (Signup in progress)");
          } else {
            console.error("Auth Profile Error:", err);
          }
        }
      } else {
        setCurrentUser(null);
        setRole(null);
        localStorage.removeItem("authToken");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user: currentUser, role, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
