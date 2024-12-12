import { createContext, useState } from "react";
export const AuthContext = createContext({});
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const logout = () => {
    setAuth({ token: "", email: "" });
    localStorage.removeItem("token");
  };
  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
