import { createContext, useState } from "react";

export const AuthContext = createContext({});
export const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState({
    token: "",
    email: "",
    activeOffers: [],
    tiersList: [],
    currentTierStatus: null,
  });
 
  const logout = () => {
    setAuth({
      token: "",
      email: "",
      activeOffers: [],
      tiersList: [],
      currentTierStatus: null,
    });
    localStorage.removeItem("token");
  };
 
  const setActiveOffers = (offers) => {
    setAuth((prevAuth) => ({ ...prevAuth, activeOffers: offers }));
  };
 
  const setTiersList = (tiers) => {
    setAuth((prevAuth) => ({ ...prevAuth, tiersList: tiers }));
  };
 
  const setCurrentTierStatus = (tierStatus) => {
    setAuth((prevAuth) => ({ ...prevAuth, currentTierStatus: tierStatus }));
  };
 
  return (
<AuthContext.Provider
      value={{
        auth,
        setAuth,
        logout,
        setActiveOffers,
        setTiersList,
        setCurrentTierStatus,
      }}
>
      {children}
</AuthContext.Provider>
  );
};
