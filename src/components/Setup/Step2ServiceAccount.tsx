import { useState, useEffect } from "react";
import { ISetupStepBodyProps } from "pages/Setup";

import { Typography, Link, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InlineOpenInNewIcon from "components/InlineOpenInNewIcon";
import InfoIcon from "@mui/icons-material/InfoOutlined";

import SetupItem from "./SetupItem";

import { name } from "@root/package.json";
import { useAppContext } from "contexts/AppContext";
import { RunRoutes } from "constants/runRoutes";

export default function Step2ServiceAccount({
  rowyRunUrl,
  completion,
  setCompletion,
}: ISetupStepBodyProps) {
  const [hasAllRoles, setHasAllRoles] = useState(completion.serviceAccount);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "loading" | "pass" | "fail"
  >("idle");

  const { projectId } = useAppContext();
  const [region, setRegion] = useState("");
  useEffect(() => {
    fetch(rowyRunUrl + RunRoutes.region.path, {
      method: RunRoutes.region.method,
    })
      .then((res) => res.json())
      .then((data) => setRegion(data.region))
      .catch((e) => console.error(e));
  }, []);

  const verifyRoles = async () => {
    setVerificationStatus("loading");
    try {
      const result = await checkServiceAccount(rowyRunUrl);
      if (result) {
        setVerificationStatus("pass");
        setHasAllRoles(true);
        setCompletion((c) => ({ ...c, serviceAccount: true }));
      } else {
        setVerificationStatus("fail");
        setHasAllRoles(false);
      }
    } catch (e) {
      console.error(e);
      setVerificationStatus("fail");
    }
  };

  return (
    <>
      <Typography variant="inherit">
        {name} Run uses the{" "}
        <Link
          href="https://firebase.google.com/docs/admin/setup"
          target="_blank"
          rel="noopener noreferrer"
        >
          Firebase Admin SDK
        </Link>{" "}
        and{" "}
        <Link
          href="https://github.com/googleapis/google-cloud-node"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Cloud SDKs
        </Link>{" "}
        to make changes to your Firestore database, authenticated with a{" "}
        <Link
          href="https://firebase.google.com/support/guides/service-accounts"
          target="_blank"
          rel="noopener noreferrer"
        >
          service account
        </Link>
        . Rowy Run operates exclusively on your GCP project and we will never
        have access to your service account or any of your data.
      </Typography>

      <SetupItem
        status={hasAllRoles ? "complete" : "incomplete"}
        title={
          hasAllRoles
            ? "Rowy Run has access to a service account with all the required IAM roles:"
            : "Set up a service account with the following IAM roles:"
        }
      >
        <ul style={{ marginTop: 0 }}>
          <li>Service Account User – required to deploy Cloud Functions</li>
          <li>Firebase Authentication Admin</li>
          <li>Firestore Service Agent</li>
        </ul>

        {!hasAllRoles && (
          <>
            <Stack direction="row" spacing={1}>
              <LoadingButton
                loading={!region}
                href={`https://console.cloud.google.com/run/deploy/${region}/rowy-run?project=${projectId}`}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<OpenInNewIcon />}
              >
                Set Up Service Account
              </LoadingButton>
              <LoadingButton
                variant="contained"
                color="primary"
                onClick={verifyRoles}
                loading={verificationStatus === "loading"}
              >
                Verify
              </LoadingButton>
            </Stack>

            <Stack direction="row" spacing={1}>
              <InfoIcon aria-label="Info" color="action" sx={{ mt: -0.25 }} />
              <Typography variant="body2">
                On the Google Cloud Console page, click the Security tab to set
                the service account for Rowy Run.
              </Typography>
            </Stack>
          </>
        )}

        <Link
          href="https://cloud.google.com/iam/docs/understanding-roles"
          target="_blank"
          rel="noopener noreferrer"
          variant="body2"
        >
          Learn about IAM roles
          <InlineOpenInNewIcon />
        </Link>
      </SetupItem>
    </>
  );
}

export const checkServiceAccount = async (rowyRunUrl: string) => {
  const req = await fetch(rowyRunUrl + RunRoutes.serviceAccountAccess.path, {
    method: RunRoutes.serviceAccountAccess.method,
  });
  if (!req.ok) return false;

  const res = await req.json();
  return Object.values(res).reduce(
    (acc, value) => acc && value,
    true
  ) as boolean;
};
