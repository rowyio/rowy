import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import AuthContext from "./contexts/authContext";

interface IAuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    auth.onAuthStateChanged(auth => {
      setCurrentUser(auth);
    });
  }, []);
  // if (currentUser) {
  //   // checks  if current user  has admin role, signout user  to regenerate  token
  //   currentUser
  //     .getIdTokenResult()
  //     .then((idTokenResult: any) => {
  //       if (
  //         !idTokenResult.claims.roles ||
  //         !idTokenResult.claims.roles.includes("admin")
  //       ) {
  //         auth.signOut();
  //         console.log("logout");
  //       }
  //     })
  //     .catch((error: any) => {
  //       console.log(error);
  //     });
  // }
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
