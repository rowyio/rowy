import {
  GoogleAuthProvider,
  TwitterAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  EmailAuthProvider,
  PhoneAuthProvider,
} from "firebase/auth";
import * as firebaseui from "firebaseui";

import twitterLogo from "@src/assets/logos/twitter.svg";
import facebookLogo from "@src/assets/logos/facebook.svg";
import githubLogo from "@src/assets/logos/github.svg";
import appleLogo from "@src/assets/logos/apple.svg";
import yahooLogo from "@src/assets/logos/yahoo.svg";

import { EXTERNAL_LINKS } from "@src/constants/externalLinks";

export const authOptions = {
  google: {
    provider: GoogleAuthProvider.PROVIDER_ID,
    customParameters: {
      // Forces account selection even when one account is available
      prompt: "select_account",
    },
  },
  twitter: {
    provider: TwitterAuthProvider.PROVIDER_ID,
    iconUrl: twitterLogo,
  },
  facebook: {
    provider: FacebookAuthProvider.PROVIDER_ID,
    iconUrl: facebookLogo,
  },
  github: {
    provider: GithubAuthProvider.PROVIDER_ID,
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
    provider: EmailAuthProvider.PROVIDER_ID,
    requireDisplayName: true,
    disableSignUp: { status: true },
  },
  phone: {
    provider: PhoneAuthProvider.PROVIDER_ID,
  },
  anonymous: {
    provider: firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
  },
};

export const defaultUiConfig: firebaseui.auth.Config = {
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: [authOptions.google],
  tosUrl: EXTERNAL_LINKS.terms,
  privacyPolicyUrl: EXTERNAL_LINKS.privacy,
};

export const getSignInOptions = (
  selected: Array<keyof typeof authOptions>
): firebaseui.auth.Config["signInOptions"] =>
  selected.map((option) => authOptions[option]);
