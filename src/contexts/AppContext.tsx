import React, { useEffect, useState, useContext } from "react";
import { projectId, auth, db } from "@src/firebase";
import firebase from "firebase/app";
import useDoc from "hooks/useDoc";
import createPersistedState from "use-persisted-state";
import { analytics } from "analytics";
import {
  useMediaQuery,
  ThemeProvider,
  ThemeOptions,
  CssBaseline,
} from "@material-ui/core";
import themes from "theme";

import ErrorBoundary from "components/ErrorBoundary";
import { name } from "@root/package.json";
import { USERS } from "config/dbPaths";

const useThemeState = createPersistedState("__ROWY__THEME");
const useThemeOverriddenState = createPersistedState(
  "__ROWY__THEME_OVERRIDDEN"
);

interface AppContextInterface {
  currentUser: firebase.User | null | undefined;
  userDoc: any;
  theme: keyof typeof themes;
  themeOverridden: boolean;
  setTheme: React.Dispatch<React.SetStateAction<keyof typeof themes>>;
  setThemeOverridden: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = React.createContext<AppContextInterface>({
  currentUser: undefined,
  userDoc: undefined,
  theme: "light",
  themeOverridden: false,
  setTheme: () => {},
  setThemeOverridden: () => {},
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

  useEffect(() => {
    document.title = `${projectId} • ${name}`;
  }, []);

  // Store matching userDoc
  const [userDoc, dispatchUserDoc] = useDoc({});
  // Get userDoc
  useEffect(() => {
    if (currentUser) {
      analytics.setUserId(currentUser.uid);
      analytics.setUserProperties({ instance: window.location.hostname });
      dispatchUserDoc({ path: `${USERS}/${currentUser.uid}` });
    }
  }, [currentUser]);

  // Infer theme based on system settings
  const prefersDarkTheme = useMediaQuery("(prefers-color-scheme: dark)", {
    noSsr: true,
  });
  // Store theme
  const [theme, setTheme] = useThemeState<keyof typeof themes>(
    prefersDarkTheme ? "dark" : "light"
  );
  // Store if theme was overridden
  const [themeOverridden, setThemeOverridden] = useThemeOverriddenState(false);
  // Update theme when system settings change
  useEffect(() => {
    if (themeOverridden) return;
    if (prefersDarkTheme && theme !== "dark") setTheme("dark");
    if (!prefersDarkTheme && theme !== "light") setTheme("light");
  }, [prefersDarkTheme, themeOverridden]);

  // Store themeCustomization from userDoc
  const [themeCustomization, setThemeCustomization] = useState<ThemeOptions>(
    {}
  );
  const generatedTheme = themes[theme](themeCustomization);

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
      db.doc(userDoc.path).set({ tables: {}, user: userData }, { merge: true });
    }
  }, [userDoc]);

  return (
    <AppContext.Provider
      value={{
        userDoc: { state: userDoc, dispatch: dispatchUserDoc },
        currentUser,
        theme,
        themeOverridden,
        setTheme,
        setThemeOverridden,
      }}
    >
      <ThemeProvider theme={generatedTheme}>
        <CssBaseline />
        <ErrorBoundary>{children}</ErrorBoundary>
      </ThemeProvider>
    </AppContext.Provider>
  );
};
