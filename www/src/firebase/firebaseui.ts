import firebase from "firebase/app";
import * as firebaseui from "firebaseui";

export const defaultUiConfig: firebaseui.auth.Config = {
  signInFlow: "popup",
  signInSuccessUrl: "/",
  callbacks: {
    uiShown: () => {
      const node = document.getElementById("firetable-firebaseui-skeleton");
      if (node) node.style.display = "none";
    },
  },
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};

const authOptions = {
  google: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  twitter: firebase.auth.TwitterAuthProvider.PROVIDER_ID,
  facebook: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  github: firebase.auth.GithubAuthProvider.PROVIDER_ID,
  microsoft: {
    provider: "microsoft.com",
    loginHintKey: "login_hint",
  },
  apple: { provider: "apple.com" },
  email: {
    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    requireDisplayName: true,
    disableSignUp: { status: true },
  },
  anonymous: firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
};

export const getSignInOptions = (
  selected: Partial<Record<keyof typeof authOptions, boolean>>
): firebaseui.auth.Config["signInOptions"] =>
  Object.keys(selected)
    .map((option) => (selected[option] ? authOptions[option] : null))
    .filter((option) => option !== null);
