import React, { useEffect, useState, useContext } from "react";
import { auth, db } from "../firebase";
import firebase from "firebase/app";
import useDoc from "hooks/useDoc";

interface AppContextInterface {
  currentUser: firebase.User | null | undefined;
  userDoc: any;
}

export const AppContext = React.createContext<AppContextInterface>({
  currentUser: undefined,
  userDoc: undefined,
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

  const [userDoc, dispatchUserDoc] = useDoc({});
  useEffect(() => {
    auth.onAuthStateChanged((auth) => {
      setCurrentUser(auth);
    });
  }, []);
  useEffect(() => {
    if (userDoc.doc) {
      setTheme(userDoc.doc.theme);
    } else if (
      !userDoc.doc &&
      !userDoc.loading &&
      userDoc.path &&
      currentUser
    ) {
      const userFields = ["email", "displayName", "photoURL", "phoneNumber"];
      const userData = userFields.reduce((acc, curr) => {
        if (currentUser[curr]) {
          return { ...acc, [curr]: currentUser[curr] };
        }
        return acc;
      }, {});
      db.doc(userDoc.path).set(
        {
          tables: {},
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
  }, [userDoc]);

  useEffect(() => {
    if (currentUser) {
      dispatchUserDoc({ path: `_FT_USERS/${currentUser.uid}` });
    }
  }, [currentUser]);

  return (
    <AppContext.Provider
      value={{
        userDoc: { state: userDoc, dispatch: dispatchUserDoc },
        currentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
