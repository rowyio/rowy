import React, { useEffect, useState, useContext } from "react";
import { auth, db } from "../firebase";
import firebase from "firebase/app";

interface AppContextInterface {
  currentUser: firebase.User | null | undefined;
}

export const AppContext = React.createContext<AppContextInterface>({
  currentUser: undefined,
});

export const useAppContext = () => useContext(AppContext);

interface IAppProviderProps {
  children: React.ReactNode;
  setTheme: Function;
}

export const AppProvider: React.FC<IAppProviderProps> = ({
  setTheme,
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<
    firebase.User | null | undefined
  >();

  useEffect(() => {
    auth.onAuthStateChanged(auth => {
      setCurrentUser(auth);
    });
  }, []);

  const getUserTheme = async (currentUser: firebase.User) => {
    const userDoc = await db
      .collection("_FT_USERS")
      .doc(currentUser.uid)
      .get();
    if (userDoc.exists) {
      const userDocData = userDoc.data();
      if (userDocData && userDocData.theme) {
        setTheme(userDocData.theme);
      }
    } else {
      const userFields = ["email", "displayName", "photoURL", "phoneNumber"];
      const userData = userFields.reduce((acc, curr) => {
        if (currentUser[curr]) {
          return { ...acc, [curr]: currentUser[curr] };
        }
        return acc;
      }, {});
      db.collection("_FT_USERS")
        .doc(currentUser.uid)
        .set(
          {
            user: userData,
            theme: {
              palette: {
                primary: { main: "#ef4747" },
              },
            },
          },
          { merge: true }
        );
    }
  };
  useEffect(() => {
    if (currentUser) {
      getUserTheme(currentUser);
    }
  }, [currentUser]);

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
