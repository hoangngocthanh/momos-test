import { jwtDecode } from "jwt-decode";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContextProps, TokenDecoded, UserInfo } from "src/types";

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  userInfo: null,
  logout: () => {},
  synchronizeLoginData: () => {},
});

export const AuthContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>(null);

  const synchronizeLoginData: AuthContextProps["synchronizeLoginData"] =
    useCallback(({ access_token, callback }) => {
      localStorage.setItem("token", access_token);
      const tokenDecoded: TokenDecoded = jwtDecode(access_token);
      const { email, userId } = tokenDecoded;
      setUserInfo({ email, userId });
      setIsAuthenticated(true);
      callback?.();
    }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserInfo(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  const initAuthInfo = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (token) {
        setIsAuthenticated(true);
        const tokenDecoded: TokenDecoded = jwtDecode(token);
        const { email, userId } = tokenDecoded;
        setUserInfo({ email, userId });
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuthInfo();
  }, [initAuthInfo]);

  const values = useMemo(() => {
    return {
      isAuthenticated,
      userInfo,
      logout,
      loading,
      synchronizeLoginData,
    };
  }, [isAuthenticated, loading, logout, userInfo, synchronizeLoginData]);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
