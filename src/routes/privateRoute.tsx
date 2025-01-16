import { UserContext } from "@/contexts/userContext";
import { ReactNode, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

interface PrivateProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateProps): any => {
  const { loadingAuth, signed } = useContext(UserContext);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loadingAuth) {
      setIsAuthenticated(signed);
    } else {
      // Verifique `localStorage` enquanto o contexto carrega
      const storedSigned = localStorage.getItem("signed");
      setIsAuthenticated(storedSigned ? JSON.parse(storedSigned) : false);
    }
  }, [signed, loadingAuth]);

  if (isAuthenticated === null) {
    return <div></div>;
  }

  if (!signed) {
    toast.error("Usúario não autenticado!");
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
