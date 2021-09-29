import { useState, useEffect } from "react";
import { ISetupStepBodyProps } from "pages/Setup";

import {
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Link,
  TextField,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CopyIcon from "assets/icons/Copy";
import InlineOpenInNewIcon from "components/InlineOpenInNewIcon";

import SetupItem from "./SetupItem";

import { name } from "@root/package.json";
import { useAppContext } from "contexts/AppContext";
import { CONFIG } from "config/dbPaths";
import { requiredRules, adminRules, utilFns } from "config/firestoreRules";
import { rowyRun } from "utils/rowyRun";
import { runRoutes } from "constants/runRoutes";

export default function Step4Rules({
  rowyRunUrl,
  completion,
  setCompletion,
}: ISetupStepBodyProps) {
  const { projectId, getAuthToken } = useAppContext();

  const [hasRules, setHasRules] = useState(completion.rules);
  const [adminRule, setAdminRule] = useState(true);

  const rules = `${
    adminRule ? adminRules : ""
  }${requiredRules}${utilFns}`.replace("\n", "");

  const [currentRules, setCurrentRules] = useState("");
  useEffect(() => {
    if (rowyRunUrl && !hasRules && !currentRules)
      getAuthToken(true)
        .then((authToken) =>
          rowyRun({
            rowyRunUrl,
            route: runRoutes.firestoreRules,
            authToken,
          })
        )
        .then((data) => setCurrentRules(data?.source?.[0]?.content ?? ""));
  }, [rowyRunUrl, hasRules, currentRules, getAuthToken]);

  const [newRules, setNewRules] = useState("");
  useEffect(() => {
    let rulesToInsert = rules;

    if (currentRules.indexOf("function isDocOwner") > -1) {
      rulesToInsert = rulesToInsert.replace(/function isDocOwner[^}]*}/s, "");
    }
    if (currentRules.indexOf("function hasAnyRole") > -1) {
      rulesToInsert = rulesToInsert.replace(/function hasAnyRole[^}]*}/s, "");
    }

    const inserted = currentRules.replace(
      /match\s*\/databases\/\{database\}\/documents\s*\{/,
      `match /databases/{database}/documents {\n` + rulesToInsert
    );

    setNewRules(inserted);
  }, [currentRules, rules]);

  const [rulesStatus, setRulesStatus] = useState<"LOADING" | string>("");
  const setRules = async () => {
    setRulesStatus("LOADING");
    try {
      const authToken = await getAuthToken();
      if (!authToken) throw new Error("Failed to generate auth token");

      const res = await rowyRun({
        rowyRunUrl,
        route: runRoutes.setFirestoreRules,
        authToken,
        body: { ruleset: newRules },
      });
      if (!res.success) throw new Error(res.message);

      const isSuccessful = await checkRules(rowyRunUrl, authToken);
      if (isSuccessful) {
        setCompletion((c) => ({ ...c, rules: true }));
        setHasRules(true);
      }

      setRulesStatus("IDLE");
    } catch (e: any) {
      console.error(e);
      setRulesStatus(e.message);
    }
  };

  return (
    <>
      <Typography variant="inherit">
        {name} configuration is stored in the <code>{CONFIG}</code> collection
        on Firestore. Your users will need read access to this collection and
        admins will need write access.
      </Typography>

      <SetupItem
        status={hasRules ? "complete" : "incomplete"}
        title={
          hasRules
            ? "Firestore Rules are set up."
            : "Add the following rules to enable access to Rowy configuration:"
        }
      >
        {!hasRules && (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={adminRule}
                  onChange={(e) => setAdminRule(e.target.checked)}
                />
              }
              label="Allow admins to read and write all documents"
              sx={{ "&&": { ml: -11 / 8, mb: -11 / 8 }, width: "100%" }}
            />

            <Typography
              variant="body2"
              component="pre"
              sx={{
                width: { sm: "100%", md: 840 - 72 - 32 },
                height: 136,
                resize: "both",
                overflow: "auto",

                "& .comment": { color: "info.dark" },
              }}
              dangerouslySetInnerHTML={{
                __html: rules.replace(
                  /(\/\/.*$)/gm,
                  `<span class="comment">$1</span>`
                ),
              }}
            />

            <Button
              startIcon={<CopyIcon />}
              onClick={() => navigator.clipboard.writeText(rules)}
            >
              Copy to clipboard
            </Button>
          </>
        )}
      </SetupItem>

      {!hasRules && (
        <SetupItem
          status="incomplete"
          title={
            <>
              You can add these rules{" "}
              <Link
                href={`https://console.firebase.google.com/project/${
                  projectId || "_"
                }/firestore/rules`}
                target="_blank"
                rel="noopener noreferrer"
              >
                in the Firebase Console
                <InlineOpenInNewIcon />
              </Link>{" "}
              or directly below:
            </>
          }
        >
          <TextField
            id="new-rules"
            label="New rules"
            value={newRules}
            onChange={(e) => setNewRules(e.target.value)}
            multiline
            rows={5}
            fullWidth
            sx={{
              "& .MuiInputBase-input": {
                fontFamily: "mono",
                letterSpacing: 0,
                resize: "vertical",
              },
            }}
          />

          <Typography
            variant="inherit"
            color={
              rulesStatus !== "LOADING" && rulesStatus ? "error" : undefined
            }
          >
            Please check the generated rules first.
          </Typography>

          <LoadingButton
            variant="contained"
            color="primary"
            onClick={setRules}
            loading={rulesStatus === "LOADING"}
          >
            Set Firestore Rules
          </LoadingButton>

          {rulesStatus !== "LOADING" && typeof rulesStatus === "string" && (
            <Typography variant="caption" color="error">
              {rulesStatus}
            </Typography>
          )}
        </SetupItem>
      )}
    </>
  );
}

export const checkRules = async (
  rowyRunUrl: string,
  authToken: string,
  signal?: AbortSignal
) => {
  if (!authToken) return false;

  try {
    const res = await rowyRun({
      rowyRunUrl,
      route: runRoutes.firestoreRules,
      authToken,
      signal,
    });
    const rules = res?.source?.[0]?.content || "";
    if (!rules) return false;

    const sanitizedRules = rules.replace(/\s{2,}/g, " ").replace(/\n/g, " ");
    const hasRules =
      sanitizedRules.includes(
        requiredRules.replace(/\s{2,}/g, " ").replace(/\n/g, " ")
      ) &&
      sanitizedRules.includes(
        utilFns.replace(/\s{2,}/g, " ").replace(/\n/g, " ")
      );

    return hasRules;
  } catch (e: any) {
    console.error(e);
    return false;
  }
};
