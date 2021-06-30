import firebase from "firebase/app";
import * as firebaseui from "firebaseui";
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
  anonymous: firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
}
export const getUiConfig = (selectedSignInOptions: { google?: Boolean, twitter?: Boolean, github?: Boolean, facebook?: Boolean, email?: Boolean,microsoft?:Boolean, apple?: Boolean,anonymous?:Boolean}) => ({
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: Object.keys(selectedSignInOptions).map((option) => {
    if (selectedSignInOptions[option]) {
      return authOptions[option]
    }
  }).filter((option) =>option),
  callbacks: {
    uiShown: () => {
      const node = document.getElementById("firetable-firebaseui-skeleton");
      if (node) node.style.display = "none";
    },
  },
});
