import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("token");
    const expiry = localStorage.getItem("token_expiry");

    if (savedToken && expiry) {
      const now = new Date().getTime();
      if (now < parseInt(expiry, 10)) {
        return savedToken;
      } else {
        // Si ya caducó, lo borramos
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");
        return null;
      }
    }
    return null;
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);

    // Guardar fecha de expiración a 3 horas
    const expiryTime = new Date().getTime() + 3 * 60 * 60 * 1000;
    localStorage.setItem("token_expiry", expiryTime.toString());
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
