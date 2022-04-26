import { useAtom } from "jotai";
import { globalScope } from "@src/atoms/globalScope";
import { currentUserAtom, userRolesAtom } from "@src/atoms/auth";
import { publicSettingsAtom } from "@src/atoms/project";

// import StyledFirebaseAuth from "react-firebaseui/FirebaseAuth";
// import "firebase/compat/auth";
// import { GoogleAuthProvider } from "firebase/auth";
import { firebaseAuthAtom } from "@src/sources/ProjectSourceFirebase";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { useFirestoreDocWithAtom } from "hooks/useFirestoreDocWithAtom";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { userSettingsAtom } from "@src/atoms/user";
const provider = new GoogleAuthProvider();

function CurrentUser({ currentUser }: { currentUser: User }) {
  console.log("currentUser", currentUser.uid);
  return <p>{currentUser?.email}</p>;
}

function JotaiTest() {
  const [firebaseAuth] = useAtom(firebaseAuthAtom, globalScope);
  const [currentUser] = useAtom(currentUserAtom, globalScope);
  const [userRoles] = useAtom(userRolesAtom, globalScope);
  const [publicSettings] = useAtom(publicSettingsAtom, globalScope);
  const [userSettings] = useAtom(userSettingsAtom, globalScope);
  // console.log("publicSettings", publicSettings);
  // console.log("userSettings", userSettings);

  const { enqueueSnackbar } = useSnackbar();

  useFirestoreDocWithAtom(
    publicSettingsAtom,
    globalScope,
    "_rowy_/publicSettings"
  );

  return (
    <>
      <Button
        variant={currentUser ? "outlined" : "contained"}
        color={currentUser ? "secondary" : "primary"}
        onClick={() => {
          signInWithPopup(firebaseAuth, provider);
          enqueueSnackbar("Signed in");
        }}
        sx={{ my: 4, mx: 1 }}
      >
        Sign in with Google
      </Button>
      <Button
        variant={!currentUser ? "outlined" : "contained"}
        color={!currentUser ? "secondary" : "primary"}
        onClick={() => {
          signOut(firebaseAuth);
          enqueueSnackbar("Signed out");
        }}
        sx={{ my: 4, mx: 1 }}
      >
        Sign out
      </Button>

      {currentUser === undefined && <p>Authenticating …</p>}
      {currentUser && <CurrentUser currentUser={currentUser} />}
      <p>{JSON.stringify(userRoles)}</p>

      <p>{JSON.stringify(publicSettings)}</p>

      <p>{JSON.stringify(userSettings)}</p>
      {/* <StyledFirebaseAuth
        uiConfig={{
          signInFlow: "popup",
          signInSuccessUrl: "/",
          signInOptions: [GoogleAuthProvider.PROVIDER_ID],
        }}
        firebaseAuth={firebaseAuth}
      /> */}
    </>
  );
}

export default JotaiTest;
