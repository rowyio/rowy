import React, { useState } from "react";

import {
  makeStyles,
  createStyles,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogProps,
  Grow,
  Grid,
  Typography,
  IconButton,
  MobileStepper,
  Divider,
  Button,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import CloseIcon from "@material-ui/icons/Close";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Grow ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(8),
      maxWidth: 750,

      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(3, 2),
      },
    },

    paperFullScreen: {
      display: "inline-flex",
      flexDirection: "column",
    },

    closeButton: {
      position: "absolute",
      top: theme.spacing(0.5),
      right: theme.spacing(0.5),
    },

    stepper: {
      padding: 0,
      background: "none",
      marginRight: theme.spacing(-10 / 8),
    },
    stepperButton: { padding: theme.spacing(0.5) },

    stepperDot: {
      margin: theme.spacing(0, 0.5),
      backgroundColor: theme.palette.primary.main,
    },
    stepperDotActive: {
      margin: theme.spacing(0, 0.5),
      "& ~ $stepperDot": { backgroundColor: theme.palette.action.disabled },
    },

    divider: { marginBottom: theme.spacing(2) },
    description: { marginBottom: theme.spacing(5) },
    content: { marginBottom: theme.spacing(5) },

    bigButtons: {
      [theme.breakpoints.down("xs")]: {
        margin: theme.spacing(0, -2),
        width: `calc(100% + ${theme.spacing(2 * 2)}px)`,

        marginTop: "auto",
      },
    },
    bigButton: { width: 150 },
  })
);

export interface IWizardDialogProps extends DialogProps {
  title: string;
  steps: {
    title: string;
    description?: React.ReactNode;
    content: React.ReactNode;
    disableNext?: boolean;
  }[];
  onFinish: () => void;
}

export default function WizardDialog({
  title,
  steps,
  onFinish,
  ...props
}: IWizardDialogProps) {
  const classes = useStyles();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("xs"));

  const [step, setStep] = useState(0);
  const currentStep = steps[step];

  const handleNext = () =>
    step < steps.length - 1 ? setStep((s) => s + 1) : onFinish();
  const handleBack = () =>
    step > 0 ? setStep((s) => s - 1) : props.onClose?.({}, "escapeKeyDown");

  return (
    <Dialog
      TransitionComponent={Transition}
      aria-labelledby="wizard-title"
      aria-describedby="wizard-step-description"
      fullWidth
      scroll="body"
      disableBackdropClick
      fullScreen={isXs}
      {...props}
      classes={{
        paper: classes.paper,
        paperFullScreen: classes.paperFullScreen,
        ...(props.classes ?? {}),
      }}
    >
      {!isXs && (
        <IconButton
          aria-label="Close"
          onClick={props.onClose as any}
          className={classes.closeButton}
        >
          <CloseIcon />
        </IconButton>
      )}

      <Grid container spacing={3} alignItems="flex-end">
        <Grid item xs>
          <Typography
            variant="h6"
            component="h1"
            color="textSecondary"
            id="wizard-title"
            gutterBottom
          >
            {title}
            {currentStep.title && `: ${currentStep.title}`}
          </Typography>
        </Grid>

        <Grid item>
          <MobileStepper
            variant="dots"
            position="static"
            steps={steps.length}
            activeStep={step}
            classes={{
              root: classes.stepper,
              dot: classes.stepperDot,
              dotActive: classes.stepperDotActive,
            }}
            nextButton={
              <IconButton
                aria-label="Next"
                onClick={handleNext}
                className={classes.stepperButton}
                disabled={currentStep.disableNext}
              >
                <ChevronRightIcon />
              </IconButton>
            }
            backButton={
              <IconButton
                aria-label="Back"
                onClick={handleBack}
                disabled={step <= 0}
                className={classes.stepperButton}
              >
                <ChevronLeftIcon />
              </IconButton>
            }
          />
        </Grid>
      </Grid>

      <Divider className={classes.divider} />

      {currentStep.description && (
        <Typography
          color="textSecondary"
          id="wizard-step-description"
          component={typeof currentStep.description === "string" ? "p" : "div"}
          className={classes.description}
        >
          {currentStep.description}
        </Typography>
      )}

      <div className={classes.content}>{currentStep.content}</div>

      <Grid
        container
        spacing={isXs ? 1 : 4}
        justify="center"
        alignItems="center"
        className={classes.bigButtons}
      >
        <Grid item>
          <Button
            size="large"
            variant="outlined"
            className={classes.bigButton}
            onClick={handleBack}
          >
            {step > 0 ? "Back" : "Cancel"}
          </Button>
        </Grid>
        <Grid item>
          <Button
            size="large"
            variant="contained"
            className={classes.bigButton}
            onClick={handleNext}
            disabled={currentStep.disableNext}
          >
            {step === steps.length - 1 ? "Finish" : "Continue"}
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
}
