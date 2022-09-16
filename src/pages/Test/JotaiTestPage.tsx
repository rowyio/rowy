import { useState } from "react";
import { useAtom } from "jotai";
import {
  projectScope,
  projectIdAtom,
  currentUserAtom,
  userRolesAtom,
  userSettingsAtom,
  publicSettingsAtom,
  projectSettingsAtom,
  rowyRunAtom,
} from "@src/atoms/projectScope";
import { firebaseAuthAtom } from "@src/sources/ProjectSourceFirebase";
import { Button } from "@mui/material";
import MultiSelect from "@rowy/multiselect";
import { useSnackbar } from "notistack";
import { useFirestoreDocWithAtom } from "hooks/useFirestoreDocWithAtom";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
  getIdTokenResult,
} from "firebase/auth";
import { runRoutes } from "@src/constants/runRoutes";

const provider = new GoogleAuthProvider();

function CurrentUser({ currentUser }: { currentUser: User }) {
  // console.log("currentUser", currentUser.uid);
  return <p>{currentUser?.email}</p>;
}

function JotaiTest() {
  const [firebaseAuth] = useAtom(firebaseAuthAtom, projectScope);
  const [projectId] = useAtom(projectIdAtom, projectScope);
  const [currentUser] = useAtom(currentUserAtom, projectScope);
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const [publicSettings] = useAtom(publicSettingsAtom, projectScope);
  const [projectSettings] = useAtom(projectSettingsAtom, projectScope);
  const [userSettings] = useAtom(userSettingsAtom, projectScope);
  const [rowyRun] = useAtom(rowyRunAtom, projectScope);

  const [count, setCount] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  useFirestoreDocWithAtom(
    publicSettingsAtom,
    projectScope,
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

      <MultiSelect
        multiple={false}
        onChange={console.log}
        value="2"
        options={new Array(10).fill(undefined).map((_, i) => i.toString())}
      />

      <Button onClick={() => getIdTokenResult(currentUser!).then(console.log)}>
        getIdTokenResult
      </Button>
      <Button
        onClick={() =>
          rowyRun({ route: runRoutes.version, localhost: true }).then(
            console.log
          )
        }
      >
        rowyRun
      </Button>

      {currentUser === undefined && <p>Authenticating …</p>}
      {currentUser && <CurrentUser currentUser={currentUser} />}
      <p>{JSON.stringify(userRoles)}</p>

      <p>Project: {projectId}</p>
      <p>{JSON.stringify(publicSettings)}</p>
      <p>{JSON.stringify(projectSettings)}</p>
      <p>{JSON.stringify(userSettings)}</p>

      <div>
        <Button onClick={() => setCount((c) => c + 1)}>
          Increment: {count}
        </Button>
      </div>
    </>
  );
}

export default JotaiTest;
