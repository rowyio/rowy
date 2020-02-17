import React, { useEffect, useState, useContext } from "react";
import { auth } from "./firebase";

interface AppContextInterface {
  currentUser: firebase.User | null | undefined;
}

export const AppContext = React.createContext<AppContextInterface>({
  currentUser: undefined,
});

export const useAppContext = () => useContext(AppContext);

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
