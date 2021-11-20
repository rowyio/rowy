import { useState, useEffect } from "react";
import { ISetupStepBodyProps } from "@src/pages/Setup";

import { Typography, Link, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import SetupItem from "./SetupItem";

import { name } from "@root/package.json";
import { useAppContext } from "@src/contexts/AppContext";
import { rowyRun } from "@src/utils/rowyRun";
import { runRoutes } from "@src/constants/runRoutes";
import { WIKI_LINKS } from "@src/constants/externalLinks";
import screenRecording from "@src/assets/service-account.mp4";

export default function Step2ServiceAccount({
  rowyRunUrl,
  completion,
  setCompletion,
}: ISetupStepBodyProps) {
  const [hasAllRoles, setHasAllRoles] = useState(completion.serviceAccount);
  // const [roles, setRoles] = useState<Record<string, any>>({});
  const [verificationStatus, setVerificationStatus] = useState<
    "IDLE" | "LOADING" | "FAIL"
  >("IDLE");

  const { projectId } = useAppContext();
  const [region, setRegion] = useState("");
  useEffect(() => {
    fetch(rowyRunUrl + runRoutes.region.path, {
      method: runRoutes.region.method,
    })
      .then((res) => res.json())
      .then((data) => setRegion(data.region))
      .catch((e) => console.error(e));
  }, []);

  const verifyRoles = async () => {
    setVerificationStatus("LOADING");
    try {
      const result = await checkServiceAccount(rowyRunUrl);
      // setRoles(result);
      if (result.hasAllRoles) {
        setVerificationStatus("IDLE");
        setHasAllRoles(true);
        setCompletion((c) => ({ ...c, serviceAccount: true }));
      } else {
        setVerificationStatus("FAIL");
        setHasAllRoles(false);
      }
    } catch (e) {
      console.error(e);
      setVerificationStatus("FAIL");
    }
  };

  return (
    <>
      <Typography variant="inherit">
        {name} Run uses a{" "}
        <Link
          href="https://firebase.google.com/support/guides/service-accounts"
          target="_blank"
          rel="noopener noreferrer"
          color="text.primary"
        >
          service account
        </Link>{" "}
        to access your project. It operates exclusively on your GCP project, so
        we never have access to any of your data.{" "}
        <Link
          href={WIKI_LINKS.rowyRun}
          target="_blank"
          rel="noopener noreferrer"
          color="text.secondary"
        >
          Learn more
          <InlineOpenInNewIcon />
        </Link>
      </Typography>

      <SetupItem
        status={hasAllRoles ? "complete" : "incomplete"}
        title={
          hasAllRoles
            ? "Rowy Run has access to a service account with all the required roles."
            : "Set up a service account with the following roles:"
        }
      >
        {!hasAllRoles && (
          <>
            <ul>
              <li>Service Account User</li>
              <li>Firebase Admin</li>
            </ul>

            <Stack direction="row" spacing={1}>
              <LoadingButton
                // loading={!region}
                href={`https://console.cloud.google.com/run/deploy/${region}/rowy-run?project=${projectId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Set up service account
                <InlineOpenInNewIcon />
              </LoadingButton>
              <LoadingButton
                variant="contained"
                color="primary"
                onClick={verifyRoles}
                loading={verificationStatus === "LOADING"}
              >
                Verify
              </LoadingButton>
            </Stack>

            {verificationStatus === "FAIL" && (
              <Typography variant="inherit" color="error">
                Some roles are missing. Also make sure your Firebase project has
                Firestore and Authentication enabled.{" "}
                <Link
                  href={WIKI_LINKS.setupFirebaseProject}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="text.primary"
                >
                  Setup guide
                  <InlineOpenInNewIcon />
                </Link>
              </Typography>
            )}

            <Typography variant="inherit">
              Follow the steps in the screen recording below:
            </Typography>

            <video
              src={screenRecording}
              controls
              muted
              playsInline
              style={{ width: "100%" }}
            />
          </>
        )}
      </SetupItem>
    </>
  );
}

export const checkServiceAccount = async (
  serviceUrl: string,
  signal?: AbortSignal
) => {
  try {
    const res = await rowyRun({
      serviceUrl,
      route: runRoutes.serviceAccountAccess,
      signal,
    });

    return {
      ...res,
      hasAllRoles: Object.values(res).reduce(
        (acc, value) => acc && value,
        true
      ) as boolean,
    };
  } catch (e: any) {
    console.error(e);
    return false;
  }
};
