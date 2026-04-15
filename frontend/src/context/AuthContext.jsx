import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchProfile, loginUser, signupUser } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("campusx_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      // Restore the signed-in user so refreshes feel seamless during local demos.
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { user: profile } = await fetchProfile();
        setUser(profile);
      } catch (error) {
        localStorage.removeItem("campusx_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [token]);

  const login = async (payload) => {
    const data = await loginUser(payload);
    localStorage.setItem("campusx_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const signup = async (payload) => {
    const data = await signupUser(payload);
    localStorage.setItem("campusx_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("campusx_token");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, signup, logout, isAuthenticated: Boolean(user) }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
