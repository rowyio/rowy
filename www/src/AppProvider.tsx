import React, { useEffect, useState } from "react";
import { auth } from "./firebase";

interface AppContextInterface {
  currentUser: firebase.User | null | undefined;
}

export const AppContext = React.createContext<AppContextInterface>({
  currentUser: undefined,
});

interface IAppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<IAppProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    auth.onAuthStateChanged(auth => {
      setCurrentUser(auth);
    });
  }, []);

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);
  // if (currentUser) {
  //   // checks  if current user  has admin role, signout user  to regenerate  token
  //   currentUser
  //     .getIdTokenResult()
  //     .then((idTokenResult: any) => {
  //       if (
  //         !idTokenResult.claims.roles ||
  //         !idTokenResult.claims.roles.includes("admin")
  //       ) {
  //  firebase.auth().currentUser.getIdTokenResult(true);
  //       }
  //     })
  //     .catch((error: any) => {
  //       console.log(error);
  //     });
  // }
  return (
    <AppContext.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
