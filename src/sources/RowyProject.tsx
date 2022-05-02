import { useState } from "react";
import { useSetAtom } from "jotai";
import { firebaseConfigAtom } from "@src/sources/ProjectSourceFirebase";
import { globalScope } from "@src/atoms/globalScope";

const envConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_PROJECT_WEB_API_KEY,
  authDomain: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseio.com`,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: "x",
};

export default function RowyProject({ children }: React.PropsWithChildren<{}>) {
  const [hasConfig, setHasConfig] = useState(false);
  const setConfigAtom = useSetAtom(firebaseConfigAtom, globalScope);

  if (!hasConfig) {
    return (
      <div>
        <button
          onClick={() => {
            setConfigAtom(envConfig);
            setHasConfig(true);
          }}
        >
          Load Firebase project
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
