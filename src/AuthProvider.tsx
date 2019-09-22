import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import AuthContext from "./contexts/authContext";

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    auth.onAuthStateChanged(auth => {
      setCurrentUser(auth);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
