import { useEffect } from "react";
import type { ISetupStep, ISetupStepBodyProps } from "../types";

import { Link } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import SetupItem from "../SetupItem";
import SignInWithGoogle from "../SignInWithGoogle";

import { WIKI_LINKS } from "@src/constants/externalLinks";
import { useAppContext } from "@src/contexts/AppContext";

export default {
  id: "oauth",
  shortTitle: "Access",
  title: "Allow Firebase access",
  description: (
    <>
      Allow Rowy to manage your Firebase Authentication, Firestore database, and
      Firebase Storage.
      <br />
      <br />
      Your data and code always stays on your Firebase project.{" "}
      <Link href={WIKI_LINKS.setup} target="_blank" rel="noopener noreferrer">
        Learn more
        <InlineOpenInNewIcon />
      </Link>
    </>
  ),
  body: StepOauth,
} as ISetupStep;

function StepOauth({ isComplete, setComplete }: ISetupStepBodyProps) {
  const { currentUser } = useAppContext();

  useEffect(() => {
    if (currentUser && !isComplete) setComplete();
  }, [currentUser, isComplete, setComplete]);

  return (
    <SetupItem
      title="Sign in with a Google account that has access to your Firebase project."
      status="incomplete"
    >
      <SignInWithGoogle />
    </SetupItem>
  );
}
