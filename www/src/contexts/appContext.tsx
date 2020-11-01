import React, { useEffect, useState, useContext } from "react";
import { auth, db } from "../firebase";
import firebase from "firebase/app";
import useDoc from "hooks/useDoc";

import {
  MuiThemeProvider,
  ThemeOptions,
  Theme,
  CssBaseline,
} from "@material-ui/core";
import { customizableLightTheme } from "Themes";

interface AppContextInterface {
  currentUser: firebase.User | null | undefined;
  userDoc: any;
  setTheme: React.Dispatch<
    React.SetStateAction<(customization: ThemeOptions) => Theme>
  >;
}

export const AppContext = React.createContext<AppContextInterface>({
  currentUser: undefined,
  userDoc: undefined,
  setTheme: () => {},
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC = ({ children }) => {
  // Store currentUser from Firebase Auth
  const [currentUser, setCurrentUser] = useState<
    firebase.User | null | undefined
  >();
  useEffect(() => {
    auth.onAuthStateChanged((auth) => {
      setCurrentUser(auth);
    });
  }, []);

  // Store matching userDoc
  const [userDoc, dispatchUserDoc] = useDoc({});
  // Get userDoc
  useEffect(() => {
    if (currentUser) {
      dispatchUserDoc({ path: `_FT_USERS/${currentUser.uid}` });
    }
  }, [currentUser]);

  // Store theme
  const [theme, setTheme] = useState(() => customizableLightTheme);
  // Store themeCustomization from userDoc
  const [themeCustomization, setThemeCustomization] = useState<ThemeOptions>(
    {}
  );

  useEffect(() => {
    if (userDoc.doc) {
      // Set theme customizations from user doc
      setThemeCustomization(userDoc.doc.theme);
    } else if (
      !userDoc.doc &&
      !userDoc.loading &&
      userDoc.path &&
      currentUser
    ) {
      // Set userDoc if it doesn’t exist
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

  return (
    <AppContext.Provider
      value={{
        userDoc: { state: userDoc, dispatch: dispatchUserDoc },
        currentUser,
        setTheme,
      }}
    >
      <MuiThemeProvider theme={theme(themeCustomization)}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </AppContext.Provider>
  );
};
