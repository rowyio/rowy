import { useState, useEffect } from "react";
import { ISetupStepBodyProps } from "@src/pages/Setup";

import {
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Link,
  Grid,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import CopyIcon from "@src/assets/icons/Copy";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import SetupItem from "./SetupItem";
import DiffEditor from "@src/components/CodeEditor/DiffEditor";

import { name } from "@root/package.json";
import { useAppContext } from "@src/contexts/AppContext";
import { CONFIG } from "@src/config/dbPaths";
import {
  requiredRules,
  adminRules,
  utilFns,
  insecureRule,
} from "@src/config/firestoreRules";
import { rowyRun } from "@src/utils/rowyRun";
import { runRoutes } from "@src/constants/runRoutes";
// import { useConfirmation } from "@src/components/ConfirmationDialog";

export default function Step4Rules({
  rowyRunUrl,
  completion,
  setCompletion,
}: ISetupStepBodyProps) {
  const { projectId, getAuthToken } = useAppContext();
  // const { requestConfirmation } = useConfirmation();

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
            serviceUrl: rowyRunUrl,
            route: runRoutes.firestoreRules,
            authToken,
          })
        )
        .then((data) => setCurrentRules(data?.source?.[0]?.content ?? ""));
  }, [rowyRunUrl, hasRules, currentRules, getAuthToken]);

  const insecureRuleRegExp = new RegExp(
    insecureRule
      .replace(/\//g, "\\/")
      .replace(/\*/g, "\\*")
      .replace(/\s{2,}/g, "\\s+")
      .replace(/\s/g, "\\s*")
      .replace(/\n/g, "\\s+")
      .replace(/;/g, ";?")
  );
  const hasInsecureRule = insecureRuleRegExp.test(currentRules);

  const [newRules, setNewRules] = useState("");
  useEffect(() => {
    let rulesToInsert = rules;

    if (currentRules.indexOf("function isDocOwner") > -1) {
      rulesToInsert = rulesToInsert.replace(/function isDocOwner[^}]*}/s, "");
    }
    if (currentRules.indexOf("function hasAnyRole") > -1) {
      rulesToInsert = rulesToInsert.replace(/function hasAnyRole[^}]*}/s, "");
    }

    let inserted = currentRules.replace(
      /match\s*\/databases\/\{database\}\/documents\s*\{/,
      `match /databases/{database}/documents {\n` + rulesToInsert
    );

    if (hasInsecureRule) inserted = inserted.replace(insecureRuleRegExp, "");

    setNewRules(inserted);
  }, [currentRules, rules, hasInsecureRule, insecureRuleRegExp]);

  const [rulesStatus, setRulesStatus] = useState<"LOADING" | string>("");
  const setRules = async () => {
    setRulesStatus("LOADING");
    try {
      const authToken = await getAuthToken();
      if (!authToken) throw new Error("Failed to generate auth token");

      const res = await rowyRun({
        serviceUrl: rowyRunUrl,
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
      setRulesStatus("");
    } catch (e: any) {
      console.error(e);
      setRulesStatus(e.message);
    }
  };

  const [showManualMode, setShowManualMode] = useState(false);

  // const handleSkip = () => {
  //   requestConfirmation({
  //     title: "Skip rules",
  //     body: "This might prevent you or other users in your project from accessing firestore data on Rowy",
  //     confirm: "Skip",
  //     cancel: "cancel",
  //     handleConfirm: async () => {
  //       setCompletion((c) => ({ ...c, rules: true }));
  //       setHasRules(true);
  //     },
  //   });
  // };

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

            <Typography>
              <InfoIcon
                aria-label="Info"
                sx={{ fontSize: 18, mr: 11 / 8, verticalAlign: "sub" }}
              />
              We removed an insecure rule that allows anyone to access any part
              of your database
            </Typography>

            <DiffEditor
              original={currentRules}
              modified={newRules}
              containerProps={{ sx: { width: "100%" } }}
              minHeight={400}
              options={{ renderValidationDecorations: "off" }}
            />
            <Typography
              variant="inherit"
              color={
                rulesStatus !== "LOADING" && rulesStatus ? "error" : undefined
              }
            >
              Please verify the new rules first.
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
            {!showManualMode && (
              <Link
                component="button"
                variant="body2"
                onClick={() => setShowManualMode(true)}
              >
                Alternatively, add these rules in the Firebase Console
              </Link>
            )}
          </>
        )}
      </SetupItem>

      {!hasRules && showManualMode && (
        <SetupItem
          status="incomplete"
          title="Alternatively, you can add these rules in the Firebase Console."
        >
          <Typography
            variant="caption"
            component="pre"
            sx={{
              width: "100%",
              height: 400,
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

          <div>
            <Grid container spacing={1}>
              <Grid item>
                <Button
                  startIcon={<CopyIcon />}
                  onClick={() => navigator.clipboard.writeText(rules)}
                >
                  Copy to clipboard
                </Button>
              </Grid>

              <Grid item>
                <Button
                  href={`https://console.firebase.google.com/project/${
                    projectId || "_"
                  }/firestore/rules`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Firebase Console
                  <InlineOpenInNewIcon />
                </Button>
              </Grid>
            </Grid>
          </div>
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
      serviceUrl: rowyRunUrl,
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
