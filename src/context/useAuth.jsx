import { createContext, useContext } from "react";

import React from "react";

import { AuthContext } from "./AuthProvider";

export const useAuth = () => {
  return useContext(AuthContext);
};
