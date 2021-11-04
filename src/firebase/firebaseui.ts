import firebase from "firebase/app";
import * as firebaseui from "firebaseui";

import twitterLogo from "@src/assets/logos/twitter.svg";
import facebookLogo from "@src/assets/logos/facebook.svg";
import githubLogo from "@src/assets/logos/github.svg";
import appleLogo from "@src/assets/logos/apple.svg";
import yahooLogo from "@src/assets/logos/yahoo.svg";

export const authOptions = {
  google: {
    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  },
  twitter: {
    provider: firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    iconUrl: twitterLogo,
  },
  facebook: {
    provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    iconUrl: facebookLogo,
  },
  github: {
    provider: firebase.auth.GithubAuthProvider.PROVIDER_ID,
    iconUrl: githubLogo,
  },
  microsoft: {
    provider: "microsoft.com",
    loginHintKey: "login_hint",
  },
  apple: {
    provider: "apple.com",
    iconUrl: appleLogo,
  },
  yahoo: {
    provider: "yahoo.com",
    iconUrl: yahooLogo,
  },
  email: {
    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    requireDisplayName: true,
    disableSignUp: { status: true },
  },
  phone: {
    provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
  },
  anonymous: {
    provider: firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
  },
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
