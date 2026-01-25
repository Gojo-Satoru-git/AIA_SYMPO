import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div style={{ color: "white" }}>Checking access...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (!role) {
    return <div style={{ color: "white" }}>Loading role...</div>;
  }

  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
