import { useState, useEffect } from "react";
import { use100vh } from "react-div-100vh";
import { SwitchTransition } from "react-transition-group";
import { useLocation, Link } from "react-router-dom";
import queryString from "query-string";

import {
  useMediaQuery,
  Paper,
  Stepper,
  Step,
  StepButton,
  MobileStepper,
  IconButton,
  Typography,
  Stack,
  DialogActions,
  Button,
  Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import BrandedBackground, { Wrapper } from "@src/assets/BrandedBackground";
import Logo from "@src/assets/Logo";
import ScrollableDialogContent from "@src/components/Modal/ScrollableDialogContent";
import { SlideTransition } from "@src/components/Modal/SlideTransition";

import Step0Welcome from "@src/components/Setup/Step0Welcome";
import Step1RowyRun, { checkRowyRun } from "@src/components/Setup/Step1RowyRun";
// prettier-ignore
import Step2ServiceAccount, { checkServiceAccount } from "@src/components/Setup/Step2ServiceAccount";
// prettier-ignore
import Step3ProjectOwner, { checkProjectOwner } from "@src/components/Setup/Step3ProjectOwner";
import Step4Rules, { checkRules } from "@src/components/Setup/Step4Rules";
import Step5Migrate, { checkMigrate } from "@src/components/Setup/Step5Migrate";
import Step6Finish from "@src/components/Setup/Step6Finish";

import { name } from "@root/package.json";
import routes from "@src/constants/routes";
import { useAppContext } from "@src/contexts/AppContext";
import { analytics } from "analytics";

export interface ISetupStep {
  id: string;
  layout?: "centered";
  shortTitle: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  body: React.ReactNode;
  actions?: React.ReactNode;
}

export interface ISetupStepBodyProps {
  completion: Record<string, boolean>;
  setCompletion: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  checkAllSteps: typeof checkAllSteps;
  rowyRunUrl: string;
}

const BASE_WIDTH = 1024;

const checkAllSteps = async (
  rowyRunUrl: string,
  currentUser: firebase.default.User | null | undefined,
  userRoles: string[] | null,
  authToken: string,
  signal: AbortSignal
) => {
  console.log("Check all steps");
  const completion: Record<string, boolean> = {};

  const rowyRunValidation = await checkRowyRun(rowyRunUrl, signal);
  if (rowyRunValidation.isValidRowyRunUrl) {
    if (rowyRunValidation.isLatestVersion) completion.rowyRun = true;

    const promises = [
      checkServiceAccount(rowyRunUrl, signal).then((serviceAccount) => {
        if (serviceAccount.hasAllRoles) completion.serviceAccount = true;
      }),
      checkProjectOwner(rowyRunUrl, currentUser, userRoles, signal).then(
        (projectOwner) => {
          if (projectOwner) completion.projectOwner = true;
        }
      ),
      checkRules(rowyRunUrl, authToken, signal).then((rules) => {
        if (rules) completion.rules = true;
      }),
      checkMigrate(rowyRunUrl, authToken, signal).then((requiresMigration) => {
        if (requiresMigration) completion.migrate = false;
      }),
    ];
    await Promise.all(promises);
  }

  return completion;
};

export default function SetupPage() {
  const { currentUser, userRoles, getAuthToken } = useAppContext();

  const fullScreenHeight = use100vh() ?? 0;
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  const { search } = useLocation();
  const params = queryString.parse(search);
  const rowyRunUrl = decodeURIComponent((params.rowyRunUrl as string) || "");

  const [stepId, setStepId] = useState("welcome");
  const [completion, setCompletion] = useState<Record<string, boolean>>({
    welcome: false,
    rowyRun: false,
    serviceAccount: false,
    projectOwner: false,
    rules: false,
  });

  const [checkingAllSteps, setCheckingAllSteps] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (rowyRunUrl) {
      setCheckingAllSteps(true);
      getAuthToken().then((authToken) =>
        checkAllSteps(
          rowyRunUrl,
          currentUser,
          userRoles,
          authToken,
          signal
        ).then((result) => {
          if (!signal.aborted) {
            setCompletion((c) => ({ ...c, ...result }));
            setCheckingAllSteps(false);
          }
        })
      );
    }

    return () => controller.abort();
  }, [rowyRunUrl, currentUser, userRoles, getAuthToken]);

  const stepProps = { completion, setCompletion, checkAllSteps, rowyRunUrl };

  const steps: ISetupStep[] = [
    {
      id: "welcome",
      layout: "centered" as "centered",
      shortTitle: "Welcome",
      title: `Welcome to ${name}`,
      body: <Step0Welcome {...stepProps} />,
      actions: completion.welcome ? (
        <LoadingButton
          loading={checkingAllSteps}
          variant="contained"
          color="primary"
          type="submit"
        >
          Get started
        </LoadingButton>
      ) : (
        <Tooltip title="Please accept the terms and conditions">
          <div>
            <LoadingButton
              loading={checkingAllSteps}
              variant="contained"
              color="primary"
              disabled
            >
              Get started
            </LoadingButton>
          </div>
        </Tooltip>
      ),
    },
    {
      id: "rowyRun",
      shortTitle: `${name} Run`,
      title: `Set up ${name} Run`,
      body: <Step1RowyRun {...stepProps} />,
    },
    {
      id: "serviceAccount",
      shortTitle: `Service account`,
      title: `Set up service account`,
      body: <Step2ServiceAccount {...stepProps} />,
    },
    {
      id: "projectOwner",
      shortTitle: `Project owner`,
      title: `Set up project owner`,
      body: <Step3ProjectOwner {...stepProps} />,
    },
    {
      id: "rules",
      shortTitle: `Rules`,
      title: `Set up Firestore Rules`,
      body: <Step4Rules {...stepProps} />,
    },
    completion.migrate !== undefined
      ? {
          id: "migrate",
          shortTitle: `Migrate`,
          title: `Migrate to ${name} (optional)`,
          body: <Step5Migrate {...stepProps} />,
        }
      : ({} as ISetupStep),
    {
      id: "finish",
      layout: "centered" as "centered",
      shortTitle: `Finish`,
      title: `You’re all set up!`,
      body: <Step6Finish />,
      actions: (
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={routes.home}
          sx={{ ml: 1 }}
        >
          Continue to {name}
        </Button>
      ),
    },
  ].filter((x) => x.id);

  const step =
    steps.find((step) => step.id === (stepId || steps[0].id)) ?? steps[0];
  const stepIndex = steps.findIndex(
    (step) => step.id === (stepId || steps[0].id)
  );
  const listedSteps = steps.filter((step) => step.layout !== "centered");

  const handleContinue = () => {
    let nextIncompleteStepIndex = stepIndex + 1;
    while (completion[steps[nextIncompleteStepIndex]?.id]) {
      console.log("iteration", steps[nextIncompleteStepIndex]?.id);
      nextIncompleteStepIndex++;
    }

    const nextStepId = steps[nextIncompleteStepIndex].id;
    analytics.logEvent("setup_step", { step: nextStepId });
    setStepId(nextStepId);
  };

  return (
    <Wrapper>
      <BrandedBackground />
      <Paper
        component="main"
        elevation={4}
        sx={{
          backgroundColor: (theme) =>
            alpha(theme.palette.background.paper, 0.5),
          backdropFilter: "blur(20px) saturate(150%)",

          maxWidth: BASE_WIDTH,
          width: (theme) => `calc(100vw - ${theme.spacing(2)})`,
          maxHeight: (theme) =>
            `calc(${
              fullScreenHeight > 0 ? `${fullScreenHeight}px` : "100vh"
            } - ${theme.spacing(
              2
            )} - env(safe-area-inset-top) - env(safe-area-inset-bottom))`,
          height: BASE_WIDTH * 0.75,
          resize: "both",

          p: 0,
          "& > *, & > .MuiDialogContent-root": { px: { xs: 2, sm: 4 } },
          display: "flex",
          flexDirection: "column",

          "& .MuiTypography-inherit, & .MuiDialogContent-root": {
            typography: "body1",
          },
        }}
      >
        {stepId === "welcome" ? null : !isMobile ? (
          <Stepper
            activeStep={stepIndex - 1}
            nonLinear
            sx={{
              mt: 2.5,
              mb: 3,
              "& .MuiStep-root:first-child": { pl: 0 },
              "& .MuiStep-root:last-child": { pr: 0 },
              userSelect: "none",
            }}
          >
            {listedSteps.map(({ id, shortTitle }, i) => (
              <Step key={id} completed={completion[id]}>
                <StepButton
                  onClick={() => setStepId(id)}
                  disabled={i > 0 && !completion[listedSteps[i - 1]?.id]}
                  sx={{ py: 2, my: -2, borderRadius: 1 }}
                >
                  {shortTitle}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        ) : (
          <MobileStepper
            variant="dots"
            steps={listedSteps.length}
            activeStep={stepIndex - 1}
            backButton={
              <IconButton
                aria-label="Previous step"
                disabled={stepIndex === 0}
                onClick={() => setStepId(steps[stepIndex - 1].id)}
              >
                <ChevronLeftIcon />
              </IconButton>
            }
            nextButton={
              <IconButton
                aria-label="Next step"
                disabled={!completion[stepId]}
                onClick={() => setStepId(steps[stepIndex + 1].id)}
              >
                <ChevronRightIcon />
              </IconButton>
            }
            position="static"
            sx={{
              background: "none",
              p: 0,
              "& .MuiMobileStepper-dot": { mx: 0.5 },
            }}
          />
        )}

        {step.layout === "centered" ? (
          <ScrollableDialogContent disableTopDivider>
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={3}
              sx={{
                minHeight: "100%",
                maxWidth: 440,
                margin: "0 auto",
                textAlign: "center",
                py: 3,
              }}
            >
              {stepId === "welcome" && (
                <SwitchTransition mode="out-in">
                  <SlideTransition key={stepId} appear timeout={50}>
                    <Logo size={2} />
                  </SlideTransition>
                </SwitchTransition>
              )}

              <SwitchTransition mode="out-in">
                <SlideTransition key={stepId} appear timeout={100}>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{ mb: 1, typography: { xs: "h5", md: "h4" } }}
                  >
                    {step.title}
                  </Typography>
                </SlideTransition>
              </SwitchTransition>

              <SwitchTransition mode="out-in">
                <SlideTransition key={stepId} appear timeout={150}>
                  <Stack spacing={4} alignItems="center">
                    {step.body}
                  </Stack>
                </SlideTransition>
              </SwitchTransition>
            </Stack>
          </ScrollableDialogContent>
        ) : (
          <>
            <SwitchTransition mode="out-in">
              <SlideTransition key={stepId} appear timeout={50}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ mb: 1, typography: { xs: "h5", md: "h4" } }}
                >
                  {step.title}
                </Typography>
              </SlideTransition>
            </SwitchTransition>

            <SwitchTransition mode="out-in">
              <SlideTransition key={stepId} appear timeout={100}>
                <ScrollableDialogContent
                  disableTopDivider={step.layout === "centered"}
                  sx={{ overflowX: "auto" }}
                >
                  <Stack spacing={4}>{step.body}</Stack>
                </ScrollableDialogContent>
              </SlideTransition>
            </SwitchTransition>
          </>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            try {
              handleContinue();
            } catch (e: any) {
              throw new Error(e.message);
            }
            return false;
          }}
        >
          <DialogActions>
            {step.actions ?? (
              <LoadingButton
                variant="contained"
                color="primary"
                type="submit"
                loading={checkingAllSteps}
                disabled={!completion[stepId]}
              >
                Continue
              </LoadingButton>
            )}
          </DialogActions>
        </form>
      </Paper>
    </Wrapper>
  );
}
