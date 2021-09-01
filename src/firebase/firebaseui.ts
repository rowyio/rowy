import firebase from "firebase/app";
import * as firebaseui from "firebaseui";

export const authOptions = {
  google: {
    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    buttonColor: "#4285F4",
  },
  twitter: firebase.auth.TwitterAuthProvider.PROVIDER_ID,
  facebook: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  github: {
    provider: firebase.auth.GithubAuthProvider.PROVIDER_ID,
    buttonColor: "#000",
  },
  microsoft: {
    provider: "microsoft.com",
    loginHintKey: "login_hint",
    buttonColor: "#000",
  },
  apple: { provider: "apple.com" },
  yahoo: { provider: "yahoo.com" },
  email: {
    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    requireDisplayName: true,
    disableSignUp: { status: true },
  },
  phone: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
  anonymous: firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
};

export const defaultUiConfig: firebaseui.auth.Config = {
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: [authOptions.google],
};

export const getSignInOptions = (
  selected: Array<keyof typeof authOptions>
): firebaseui.auth.Config["signInOptions"] =>
  selected.map((option) => authOptions[option]);
