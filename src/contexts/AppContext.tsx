import React, { useEffect, useState, useContext, useMemo } from "react";
import firebase from "firebase/app";
import createPersistedState from "use-persisted-state";
import _merge from "lodash/merge";
import Helmet from "react-helmet";
import jwt_decode from "jwt-decode";
import { useMediaQuery, ThemeProvider, CssBaseline } from "@mui/material";

import ErrorBoundary from "@src/components/ErrorBoundary";

import { projectId, auth, db } from "@src/firebase";
import useDoc from "@src/hooks/useDoc";
import { PUBLIC_SETTINGS, USERS } from "@src/config/dbPaths";
import { analytics } from "analytics";
import themes from "theme";
import useDocumentTitle from "@src/hooks/useDocumentTitle";

const useThemeState = createPersistedState("__ROWY__THEME");
const useThemeOverriddenState = createPersistedState(
  "__ROWY__THEME_OVERRIDDEN"
);

interface IAppContext {
  projectId: string;
  currentUser: firebase.User | null | undefined;
  userClaims: Record<string, any> | undefined;
  userRoles: string[];
  getAuthToken: (forceRefresh?: boolean) => Promise<string>;
  userDoc: any;
  theme: keyof typeof themes;
  themeOverridden: boolean;
  setTheme: React.Dispatch<React.SetStateAction<keyof typeof themes>>;
  setThemeOverridden: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = React.createContext<IAppContext>({
  projectId: "",
  currentUser: undefined,
  userClaims: undefined,
  userRoles: [],
  getAuthToken: async () => await "",
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
  // Store user auth data
  const [userClaims, setUserClaims] =
    useState<IAppContext["userClaims"]>(undefined);
  const [userRoles, setUserRoles] = useState<IAppContext["userRoles"]>([]);
  const [authToken, setAuthToken] = useState<string>("");

  // Get user data from Firebase Auth event

  const getAuthToken = async (forceRefresh: boolean = false) => {
    // check if token is expired
    if (currentUser && forceRefresh) {
      const res = await currentUser.getIdTokenResult(true);
      setAuthToken(res.token as string);
      return res.token;
    }

    if (currentUser && authToken) {
      const token: any = jwt_decode(authToken);
      if (token && token.exp * 1000 < Date.now()) {
        // token is expired
        const res = await currentUser.getIdTokenResult(true);
        setAuthToken(res.token as string);
        return res.token;
      } else return authToken;
    } else return "";
  };
  useEffect(() => {
    auth.onAuthStateChanged((auth) => {
      if (auth) {
        auth.getIdTokenResult(true).then((results) => {
          setCurrentUser(auth);
          setAuthToken(results.token);
          setUserRoles(
            Array.isArray(results.claims.roles) ? results.claims.roles : []
          );
          setUserClaims(results.claims);
        });
      } else {
        setCurrentUser(auth);
      }
    });
  }, []);

  useDocumentTitle(projectId);

  const [publicSettings] = useDoc(
    { path: PUBLIC_SETTINGS },
    { createIfMissing: true }
  );

  // Store matching userDoc
  const [userDoc, dispatchUserDoc] = useDoc({}, { createIfMissing: true });
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
    if (
      (!userDoc.doc || !userDoc.doc.user) &&
      !userDoc.loading &&
      userDoc.path &&
      currentUser
    ) {
      const userFields = ["email", "displayName", "photoURL", "phoneNumber"];
      const user = userFields.reduce((acc, curr) => {
        if (currentUser[curr]) return { ...acc, [curr]: currentUser[curr] };
        return acc;
      }, {});
      db.doc(userDoc.path).set({ user }, { merge: true });
    }
  }, [userDoc, currentUser]);
  // Sync userRoles
  useEffect(() => {
    if (
      userDoc.path &&
      userRoles.length > 0 &&
      (!Array.isArray(userDoc.doc?.roles) || userDoc.doc.roles.length === 0)
    )
      db.doc(userDoc.path).update({ roles: userRoles });
  }, [userDoc.path, userDoc.doc, userRoles]);

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
      publicSettings.doc?.theme?.light,
      userDoc.doc?.theme?.base,
      userDoc.doc?.theme?.light
    );
    const darkCustomizations = _merge(
      {},
      publicSettings.doc?.theme?.base,
      publicSettings.doc?.theme?.dark,
      userDoc.doc?.theme?.base,
      userDoc.doc?.theme?.dark
    );

    return {
      light: themes.light(lightCustomizations),
      dark: themes.dark(darkCustomizations),
    };
  }, [userDoc.doc, publicSettings.doc]);

  return (
    <AppContext.Provider
      value={{
        projectId,
        currentUser,
        userClaims,
        userRoles,
        getAuthToken,
        userDoc: { state: userDoc, dispatch: dispatchUserDoc },
        theme,
        themeOverridden,
        setTheme,
        setThemeOverridden,
      }}
    >
      {Array.isArray(customizedThemes[theme].typography.fontCssUrls) && (
        <Helmet>
          {customizedThemes[theme].typography.fontCssUrls!.map((url) => (
            <link key={url} rel="stylesheet" href={url} />
          ))}
        </Helmet>
      )}

      <ThemeProvider theme={customizedThemes[theme]}>
        <CssBaseline />
        <ErrorBoundary>{children}</ErrorBoundary>
      </ThemeProvider>
    </AppContext.Provider>
  );
};
