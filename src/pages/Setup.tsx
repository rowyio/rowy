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
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import BrandedBackground from "assets/BrandedBackground";
import Logo from "assets/Logo";
import ScrollableDialogContent from "components/Modal/ScrollableDialogContent";
import { SlideTransition } from "components/Modal/SlideTransition";

import Step0Welcome from "@src/components/Setup/Step0Welcome";
import Step1RowyRun, {
  checkCompletionRowyRun,
} from "@src/components/Setup/Step1RowyRun";

import { useAppContext } from "contexts/AppContext";
import { name } from "@root/package.json";
import routes from "constants/routes";

export interface ISetupStep {
  id: string;
  layout?: "centered" | "step";
  shortTitle: string;
  title: React.ReactNode;
  description: React.ReactNode;
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
  setCompletion: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
) => {
  console.log("Check all steps");
  const completion: Record<string, boolean> = {};

  const checkRowyRun = await checkCompletionRowyRun(rowyRunUrl);
  if (checkRowyRun.isValidRowyRunUrl) {
    if (checkRowyRun.isLatestVersion) completion.rowyRun = true;
  }

  if (Object.keys(completion).length > 0)
    setCompletion((c) => ({ ...c, ...completion }));
};

export default function SetupPage() {
  const { projectId } = useAppContext();
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
    signIn: false,
    rules: false,
    migrate: false,
  });

  useEffect(() => {
    if (rowyRunUrl) checkAllSteps(rowyRunUrl, setCompletion);
  }, [rowyRunUrl]);

  const stepProps = { completion, setCompletion, checkAllSteps, rowyRunUrl };

  const steps: ISetupStep[] = [
    {
      id: "welcome",
      layout: "centered",
      shortTitle: "Welcome",
      title: `Welcome to ${name}`,
      description: (
        <>
          <Typography variant="body1" gutterBottom>
            Get up and running in around 5 minutes.
          </Typography>
          <Typography variant="body1" paragraph>
            You’ll easily set up backend functionality, Firestore Rules, and
            user management.
          </Typography>
          <Typography variant="body1">
            You’ll set up the project: <b>{projectId}</b>
          </Typography>
        </>
      ),
      body: <Step0Welcome {...stepProps} />,
      actions: completion.welcome ? (
        <Button variant="contained" color="primary" type="submit">
          Get Started
        </Button>
      ) : (
        <Tooltip title="Please accept the terms and conditions">
          <div>
            <Button variant="contained" color="primary" disabled>
              Get Started
            </Button>
          </div>
        </Tooltip>
      ),
    },
    {
      id: "rowyRun",
      shortTitle: `${name} Run`,
      title: `Set Up ${name} Run`,
      description: `${name} Run is a Google Cloud Run instance that provides back-end functionality, such as table action scripts, user management, and easy Cloud Function deployment.`,
      body: <Step1RowyRun {...stepProps} />,
    },
    {
      id: "serviceAccount",
      shortTitle: `Service Account`,
      title: `Set Up Service Account`,
      description: `${name} Run is a Google Cloud Run instance that provides back-end functionality, such as table action scripts, user management, and easy Cloud Functions deployment. Learn more`,
      body: `x`,
    },
    {
      id: "signIn",
      shortTitle: `Sign In`,
      title: `Sign In as the Project Owner`,
      description: `${name} Run is a Google Cloud Run instance that provides back-end functionality, such as table action scripts, user management, and easy Cloud Functions deployment. Learn more`,
      body: `x`,
    },
    {
      id: "rules",
      shortTitle: `Rules`,
      title: `Set Up Firestore Rules`,
      description: `${name} Run is a Google Cloud Run instance that provides back-end functionality, such as table action scripts, user management, and easy Cloud Functions deployment. Learn more`,
      body: `x`,
    },
    {
      id: "migrate",
      shortTitle: `Migrate`,
      title: `Migrate to ${name}`,
      description: `${name} Run is a Google Cloud Run instance that provides back-end functionality, such as table action scripts, user management, and easy Cloud Functions deployment. Learn more`,
      body: `x`,
    },
    {
      id: "finish",
      layout: "centered",
      shortTitle: `Finish`,
      title: `You’re all set up!`,
      description: `You can now create a table from your Firestore collections or continue to ${name}.`,
      body: <div>x</div>,
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
  ];

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

          maxWidth: (theme) => theme.breakpoints.values.md,
          width: "100%",
          maxHeight: (theme) =>
            `calc(${
              fullScreenHeight > 0 ? `${fullScreenHeight}px` : "100vh"
            } - ${theme.spacing(
              2
            )} - env(safe-area-inset-top) - env(safe-area-inset-bottom))`,
          height: (theme) => theme.breakpoints.values.md * 0.75,

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
                  <div>
                    <Typography
                      variant="h4"
                      component="h1"
                      sx={{ mb: 1, typography: { xs: "h5", md: "h4" } }}
                    >
                      {step.title}
                    </Typography>

                    <Typography variant="inherit" component="div">
                      {step.description}
                    </Typography>
                  </div>
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
                  <Stack spacing={4}>
                    <Typography variant="body1" style={{ maxWidth: "70ch" }}>
                      {step.description}
                    </Typography>
                    {step.body}
                  </Stack>
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
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!completion[stepId]}
              >
                Continue
              </Button>
            )}
          </DialogActions>
        </form>
      </Paper>
    </>
  );
}
