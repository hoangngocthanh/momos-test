import LoadingScreen from "@components/LoadingScreen";
import useAuth from "@hooks/useAuth";
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedComponent: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  const [loadingDelay, setLoadingDelay] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingDelay(false);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  if (loading || loadingDelay) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
        }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedComponent;
