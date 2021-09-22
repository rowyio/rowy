import firebase from "firebase/app";
import * as firebaseui from "firebaseui";

import twitterLogo from "assets/logos/twitter.svg";
import facebookLogo from "assets/logos/facebook.svg";
import githubLogo from "assets/logos/github.svg";
import appleLogo from "assets/logos/apple.svg";
import yahooLogo from "assets/logos/yahoo.svg";

import { mdiGoogle } from "@mdi/js";
console.log(
  `data:image/svg+xml;utf8,` +
    encodeURIComponent(
      `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${mdiGoogle}" /></svg>`
    )
);

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
