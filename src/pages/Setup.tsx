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

import BrandedBackground from "assets/BrandedBackground";
import Logo from "assets/Logo";
import ScrollableDialogContent from "components/Modal/ScrollableDialogContent";
import { SlideTransition } from "components/Modal/SlideTransition";

import Step0Welcome from "components/Setup/Step0Welcome";
import Step1RowyRun, { checkRowyRun } from "components/Setup/Step1RowyRun";
// prettier-ignore
import Step2ServiceAccount, { checkServiceAccount } from "components/Setup/Step2ServiceAccount";
// prettier-ignore
import Step3ProjectOwner, { checkProjectOwner } from "@src/components/Setup/Step3ProjectOwner";

import { name } from "@root/package.json";
import routes from "constants/routes";
import { useAppContext } from "contexts/AppContext";

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

const checkAllSteps = async (
  rowyRunUrl: string,
  currentUser: firebase.default.User | null | undefined,
  userRoles: string[] | null,
  signal: AbortSignal
) => {
  console.log("Check all steps");
  const completion: Record<string, boolean> = {};

  const rowyRunValidation = await checkRowyRun(rowyRunUrl, signal);
  if (rowyRunValidation.isValidRowyRunUrl) {
    if (rowyRunValidation.isLatestVersion) completion.rowyRun = true;

    const serviceAccount = await checkServiceAccount(rowyRunUrl, signal);
    if (serviceAccount) completion.serviceAccount = true;

    const projectOwner = await checkProjectOwner(
      rowyRunUrl,
      currentUser,
      userRoles,
      signal
    );
    if (projectOwner) completion.projectOwner = true;
  }

  return completion;
};

export default function SetupPage() {
  const { currentUser, userRoles } = useAppContext();

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
      checkAllSteps(rowyRunUrl, currentUser, userRoles, signal).then(
        (result) => {
          if (!signal.aborted) setCompletion((c) => ({ ...c, ...result }));
          setCheckingAllSteps(false);
        }
      );
    }

    return () => controller.abort();
  }, [rowyRunUrl, currentUser, userRoles]);

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
          Get Started
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
              Get Started
            </LoadingButton>
          </div>
        </Tooltip>
      ),
    },
    {
      id: "rowyRun",
      shortTitle: `${name} Run`,
      title: `Set Up ${name} Run`,
      body: <Step1RowyRun {...stepProps} />,
    },
    {
      id: "serviceAccount",
      shortTitle: `Service Account`,
      title: `Set Up Service Account`,
      body: <Step2ServiceAccount {...stepProps} />,
    },
    {
      id: "projectOwner",
      shortTitle: `Project Owner`,
      title: `Set Up Project Owner`,
      body: <Step3ProjectOwner {...stepProps} />,
    },
    {
      id: "rules",
      shortTitle: `Rules`,
      title: `Set Up Firestore Rules`,
      body: `x`,
    },
    completion.migrate !== undefined
      ? {
          id: "migrate",
          shortTitle: `Migrate`,
          title: `Migrate to ${name} (optional)`,
          body: `x`,
        }
      : ({} as ISetupStep),
    {
      id: "finish",
      layout: "centered" as "centered",
      shortTitle: `Finish`,
      title: `You’re all set up!`,
      body: (
        <div>
          You can now create a table from your Firestore collections or continue
          to {name}
        </div>
      ),
      actions: (
        <>
          <Button variant="contained" color="primary">
            Create Table
          </Button>
          <Button component={Link} to={routes.home} sx={{ ml: 1 }}>
            Continue to {name}
          </Button>
        </>
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

    setStepId(steps[nextIncompleteStepIndex].id);
  };

  return (
    <>
      <BrandedBackground />
      <Paper
        component="main"
        elevation={4}
        sx={{
          backgroundColor: (theme) =>
            alpha(theme.palette.background.paper, 0.5),
          backdropFilter: "blur(20px) saturate(150%)",

          maxWidth: 840,
          width: "100%",
          maxHeight: (theme) =>
            `calc(${
              fullScreenHeight > 0 ? `${fullScreenHeight}px` : "100vh"
            } - ${theme.spacing(
              2
            )} - env(safe-area-inset-top) - env(safe-area-inset-bottom))`,
          height: 840 * 0.75,

          p: 0,
          "& > *": { px: { xs: 2, sm: 4 } },
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
                maxWidth: 400,
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
                <ScrollableDialogContent disableTopDivider>
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
    </>
  );
}
