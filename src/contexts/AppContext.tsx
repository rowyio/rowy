import React, { useEffect, useState, useContext, useMemo } from "react";
import firebase from "firebase/app";
import createPersistedState from "use-persisted-state";
import _merge from "lodash/merge";

import { useMediaQuery, ThemeProvider, CssBaseline } from "@material-ui/core";

import ErrorBoundary from "components/ErrorBoundary";

import { projectId, auth, db } from "@src/firebase";
import useDoc from "hooks/useDoc";
import { name } from "@root/package.json";
import { PUBLIC_SETTINGS, USERS } from "config/dbPaths";
import { analytics } from "analytics";
import themes from "theme";

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

  const [publicSettings] = useDoc(
    { path: PUBLIC_SETTINGS },
    { createIfMissing: true }
  );

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

  // Set userDoc if it doesn’t exist
  useEffect(() => {
    if (!userDoc.doc && !userDoc.loading && userDoc.path && currentUser) {
      const userFields = ["email", "displayName", "photoURL", "phoneNumber"];
      const user = userFields.reduce((acc, curr) => {
        if (currentUser[curr]) return { ...acc, [curr]: currentUser[curr] };
        return acc;
      }, {});
      db.doc(userDoc.path).set({ user }, { merge: true });
    }
  }, [userDoc, currentUser]);

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
  // Customize theme from project public settings & user settings
  const customizedThemes = useMemo(() => {
    const lightCustomizations = _merge(
      {},
      publicSettings.doc?.theme?.base,
      userDoc.doc?.theme?.base,
      publicSettings.doc?.theme?.light,
      userDoc.doc?.theme?.light
    );
    const darkCustomizations = _merge(
      {},
      publicSettings.doc?.theme?.base,
      userDoc.doc?.theme?.base,
      publicSettings.doc?.theme?.dark,
      userDoc.doc?.theme?.dark
    );

    return {
      light: themes.light(lightCustomizations),
      dark: themes.dark(darkCustomizations),
    };
  }, [userDoc.doc, publicSettings.doc]);
  console.log(customizedThemes);

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
      <ThemeProvider theme={customizedThemes[theme]}>
        <CssBaseline />
        <ErrorBoundary>{children}</ErrorBoundary>
      </ThemeProvider>
    </AppContext.Provider>
  );
};
