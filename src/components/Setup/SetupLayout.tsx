import React, { useState, createElement } from "react";
import { use100vh } from "react-div-100vh";
import { SwitchTransition } from "react-transition-group";
import type { ISetupStep } from "./SetupStep";

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
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import BrandedBackground, { Wrapper } from "@src/assets/BrandedBackground";
import Logo from "@src/assets/Logo";
import ScrollableDialogContent from "@src/components/Modal/ScrollableDialogContent";
import { SlideTransition } from "@src/components/Modal/SlideTransition";

import { analytics, logEvent } from "@src/analytics";

const BASE_WIDTH = 1024;

export interface ISetupLayoutProps {
  steps: ISetupStep[];
  completion: Record<string, boolean>;
  setCompletion: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  continueButtonLoading?: boolean | string;
  onContinue?: (
    completion: Record<string, boolean>
  ) => Promise<Record<string, boolean>>;
  logo?: React.ReactNode;
}

export default function SetupLayout({
  steps,
  completion,
  setCompletion,
  continueButtonLoading = false,
  onContinue,
  logo,
}: ISetupLayoutProps) {
  const fullScreenHeight = use100vh() ?? 0;
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  // Store current step’s ID to prevent confusion
  const [stepId, setStepId] = useState("welcome");
  // Get current step object
  const step =
    steps.find((step) => step.id === (stepId || steps[0].id)) ?? steps[0];
  // Get current step index
  const stepIndex = steps.indexOf(step);
  const listedSteps = steps.filter((step) => step.layout !== "centered");

  // Continue goes to the next incomplete step
  const handleContinue = async () => {
    let updatedCompletion = completion;
    if (onContinue && step.layout !== "centered")
      updatedCompletion = await onContinue(completion);

    let nextIncompleteStepIndex = stepIndex + 1;
    while (updatedCompletion[steps[nextIncompleteStepIndex]?.id]) {
      // console.log("iteration", steps[nextIncompleteStepIndex]?.id);
      nextIncompleteStepIndex++;
    }

    const nextStepId = steps[nextIncompleteStepIndex].id;
    logEvent(analytics, "setup_step", { step: nextStepId });
    setStepId(nextStepId);
  };

  // Inject props into step.body
  const body = createElement(step.body, {
    completion,
    setCompletion,
    isComplete: completion[step.id],
    setComplete: (value: boolean = true) =>
      setCompletion((c) => ({ ...c, [step.id]: value })),
  });

  return (
    <Wrapper>
      <BrandedBackground />
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
        <Paper
          component="main"
          elevation={4}
          sx={{
            backgroundColor: (theme) =>
              alpha(theme.palette.background.paper, 0.75),
            backdropFilter: "blur(20px) saturate(150%)",

            maxWidth: BASE_WIDTH,
            width: (theme) => `calc(100vw - ${theme.spacing(2)})`,
            height: (theme) =>
              `calc(${
                fullScreenHeight > 0 ? `${fullScreenHeight}px` : "100vh"
              } - ${theme.spacing(
                2
              )} - env(safe-area-inset-top) - env(safe-area-inset-bottom))`,
            resize: "both",

            p: 0,
            "& > *, & > .MuiDialogContent-root": { px: { xs: 2, sm: 4 } },
            display: "flex",
            flexDirection: "column",

            "& .MuiTypography-inherit, & .MuiDialogContent-root": {
              typography: "body1",
            },

            "& p": {
              maxWidth: "80ch",
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
            <ScrollableDialogContent disableTopDivider disableBottomDivider>
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
                    <SlideTransition key={stepId} appear timeout={25}>
                      {logo || <Logo size={2} />}
                    </SlideTransition>
                  </SwitchTransition>
                )}

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
                    <Typography variant="inherit">
                      {step.description}
                    </Typography>
                  </SlideTransition>
                </SwitchTransition>

                <SwitchTransition mode="out-in">
                  <SlideTransition key={stepId} appear timeout={150}>
                    <Stack spacing={4} alignItems="center">
                      {body}
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

              <ScrollableDialogContent
                disableTopDivider={step.layout === "centered"}
                sx={{ overflowX: "auto", pb: 3 }}
              >
                <SwitchTransition mode="out-in">
                  <SlideTransition key={stepId} appear timeout={100}>
                    <Typography variant="inherit">
                      {step.description}
                    </Typography>
                  </SlideTransition>
                </SwitchTransition>

                <SwitchTransition mode="out-in">
                  <SlideTransition key={stepId} appear timeout={150}>
                    <Stack spacing={4}>{body}</Stack>
                  </SlideTransition>
                </SwitchTransition>
              </ScrollableDialogContent>
            </>
          )}

          {step.layout !== "centered" && (
            <DialogActions>
              <LoadingButton
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                loading={Boolean(continueButtonLoading)}
                loadingPosition={
                  typeof continueButtonLoading === "string" ? "start" : "center"
                }
                startIcon={
                  typeof continueButtonLoading === "string" && (
                    <div style={{ width: 24 }} />
                  )
                }
                disabled={!completion[stepId]}
              >
                {typeof continueButtonLoading === "string"
                  ? continueButtonLoading
                  : "Continue"}
              </LoadingButton>
            </DialogActions>
          )}
        </Paper>
      </form>
    </Wrapper>
  );
}
