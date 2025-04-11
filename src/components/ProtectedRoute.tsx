// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface Props {
  children: React.ReactNode;
}

interface DecodedToken {
  exp: number;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/Authentication" replace />;
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired) {
      localStorage.removeItem("token");
      return <Navigate to="/Authentication" replace />;
    }
  } catch (error) {
    // If token is invalid/corrupt
    localStorage.removeItem("token");
    return <Navigate to="/Authentication" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
