import { useState, useEffect } from "react";
import { ISetupStepBodyProps } from "@src/pages/Setup";

import { Typography, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import SetupItem from "./SetupItem";

import { name } from "@root/package.json";
import { useAppContext } from "@src/contexts/AppContext";
import { CONFIG } from "@src/config/dbPaths";
import { rowyRun } from "@src/utils/rowyRun";
import { runRoutes } from "@src/constants/runRoutes";

export default function Step5Migrate({
  rowyRunUrl,
  completion,
  setCompletion,
}: ISetupStepBodyProps) {
  const { getAuthToken } = useAppContext();

  const [status, setStatus] = useState<"LOADING" | boolean | string>(
    completion.migrate
  );

  const migrate = async () => {
    setStatus("LOADING");
    try {
      const authToken = await getAuthToken();

      const res = await rowyRun({
        route: runRoutes.migrateFT2Rowy,
        serviceUrl: rowyRunUrl,
        authToken,
      });
      if (!res.success) throw new Error(res.message);

      const check = await checkMigrate(rowyRunUrl, authToken);
      if (!check.migrationRequired) {
        setCompletion((c) => ({ ...c, migrate: true }));
        setStatus(true);
      }
    } catch (e: any) {
      console.error(e);
      setStatus(e.message);
    }
  };

  return (
    <>
      <Typography variant="inherit">
        It looks like you’ve previously configured your Firestore database for
        Firetable. You can migrate this configuration, including your tables to{" "}
        {name}.
      </Typography>

      <SetupItem
        status={status === true ? "complete" : "incomplete"}
        title={
          status === true ? (
            <>
              Configuration migrated to the <code>{CONFIG}</code> collection.
            </>
          ) : (
            <>
              Migrate your configuration to the <code>{CONFIG}</code>{" "}
              collection.
            </>
          )
        }
      >
        {status !== true && (
          <>
            <LoadingButton
              variant="contained"
              color="primary"
              loading={status === "LOADING"}
              onClick={migrate}
            >
              Migrate
            </LoadingButton>
            {status !== "LOADING" && typeof status === "string" && (
              <Typography variant="caption" color="error">
                {status}
              </Typography>
            )}
          </>
        )}
      </SetupItem>
    </>
  );
}

export const checkMigrate = async (
  rowyRunUrl: string,
  authToken: string,
  signal?: AbortSignal
) => {
  if (!authToken) return false;

  try {
    const res = await rowyRun({
      serviceUrl: rowyRunUrl,
      route: runRoutes.checkFT2Rowy,
      authToken,
      signal,
    });
    return res.migrationRequired;
  } catch (e: any) {
    console.error(e);
    return false;
  }
};
