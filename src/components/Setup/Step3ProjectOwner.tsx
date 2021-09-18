import { useState, useEffect } from "react";
import { ISetupStepBodyProps } from "pages/Setup";

import { Typography, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import SetupItem from "./SetupItem";
import SignInWithGoogle from "./SignInWithGoogle";

import { useAppContext } from "contexts/AppContext";
import { rowyRun } from "utils/rowyRun";
import { runRoutes } from "constants/runRoutes";

export default function Step3ProjectOwner({
  rowyRunUrl,
  completion,
  setCompletion,
}: ISetupStepBodyProps) {
  const { projectId, currentUser, getAuthToken } = useAppContext();

  const [email, setEmail] = useState("");
  useEffect(() => {
    rowyRun({ rowyRunUrl, route: runRoutes.projectOwner })
      .then((data) => setEmail(data.email))
      .catch((e: any) => {
        console.error(e);
        alert(`Failed to get project owner email: ${e.message}`);
      });
  }, [rowyRunUrl]);

  const isSignedIn = currentUser?.email === email;
  const [hasRoles, setHasRoles] = useState<boolean | "LOADING" | string>(
    completion.projectOwner
  );

  const setRoles = async () => {
    setHasRoles("LOADING");
    try {
      const authToken = await getAuthToken();
      const res = await rowyRun({
        route: runRoutes.setOwnerRoles,
        rowyRunUrl,
        authToken,
      });

      if (!res.success)
        throw new Error(`${res.message}. Project owner: ${res.ownerEmail}`);

      setHasRoles(true);
      setCompletion((c) => ({ ...c, projectOwner: true }));
    } catch (e: any) {
      console.error(e);
      setHasRoles(e.message);
    }
  };

  return (
    <>
      <Typography variant="inherit">
        The project owner requires the admin and owner roles to have full access
        to manage this project. The default project owner is the Google Cloud
        account used to deploy Rowy Run:{" "}
        <b style={{ userSelect: "all" }}>{email}</b>
      </Typography>

      <SetupItem
        status={isSignedIn ? "complete" : "incomplete"}
        title={
          isSignedIn
            ? "Firebase Authentication is set up."
            : "Check that Firebase Authentication is set up with:"
        }
      >
        {!isSignedIn && (
          <>
            <ol>
              <li>the Google auth provider enabled and</li>
              <li>
                this domain authorized:{" "}
                <b style={{ userSelect: "all" }}>{window.location.hostname}</b>
              </li>
            </ol>

            <Button
              href={`https://console.firebase.google.com/project/${
                projectId || "_"
              }/authentication/providers`}
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<OpenInNewIcon />}
            >
              Set Up in Firebase Console
            </Button>
          </>
        )}
      </SetupItem>

      <SetupItem
        status={isSignedIn ? "complete" : "incomplete"}
        title={
          isSignedIn ? (
            `You’re signed in as the project owner.`
          ) : (
            <>
              Sign in as the project owner: <b>{email}</b>
            </>
          )
        }
      >
        {!isSignedIn && (
          <SignInWithGoogle
            matchEmail={email}
            loading={!email ? true : undefined}
          />
        )}
      </SetupItem>

      {isSignedIn && (
        <SetupItem
          status={hasRoles === true ? "complete" : "incomplete"}
          title={
            hasRoles === true
              ? "The project owner has the admin and owner roles."
              : "Assign the admin and owner roles to the project owner."
          }
        >
          {hasRoles !== true && (
            <div>
              <LoadingButton
                variant="contained"
                color="primary"
                loading={hasRoles === "LOADING"}
                onClick={setRoles}
              >
                Assign Roles
              </LoadingButton>

              {typeof hasRoles === "string" && hasRoles !== "LOADING" && (
                <Typography
                  variant="caption"
                  color="error"
                  display="block"
                  sx={{ mt: 0.5 }}
                >
                  {hasRoles}
                </Typography>
              )}
            </div>
          )}
        </SetupItem>
      )}
    </>
  );
}

export const checkProjectOwner = async (
  rowyRunUrl: string,
  currentUser: firebase.default.User | null | undefined,
  userRoles: string[] | null,
  signal?: AbortSignal
) => {
  if (!currentUser || !Array.isArray(userRoles)) return false;

  try {
    const res = await rowyRun({
      rowyRunUrl,
      route: runRoutes.projectOwner,
      signal,
    });
    const email = res.email;
    if (currentUser.email !== email) return false;
    return userRoles.includes("ADMIN") && userRoles.includes("OWNER");
  } catch (e: any) {
    console.error(e);
    return false;
  }
};
