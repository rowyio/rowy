import React, { useState } from "react";
import clsx from "clsx";

import {
  makeStyles,
  createStyles,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogProps,
  DialogTitle,
  Grid,
  Typography,
  IconButton,
  MobileStepper,
  DialogContent,
  Button,
} from "@material-ui/core";
import { fade } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import { SlideTransitionMui } from "components/Modal/SlideTransition";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "--spacing-modal": theme.spacing(3) + "px",
      "--spacing-modal-contents": theme.spacing(3) + "px",
      "--spacing-card": "var(--spacing-modal-contents)",

      [theme.breakpoints.down("sm")]: {
        "--spacing-modal": theme.spacing(2) + "px",
      },
    },

    paper: {
      userSelect: "none",
      overflowX: "hidden",

      padding: "var(--spacing-modal)",
      paddingBottom: "var(--spacing-modal-contents)",
    },

    closeButton: {
      alignSelf: "flex-end",
      margin:
        "calc(var(--spacing-modal) * -1) calc(var(--spacing-modal) * -1) 0 0",
    },

    titleRow: { paddingBottom: "var(--spacing-modal)" },
    titleContainer: { padding: 0 },
    title: {
      ...theme.typography.h5,
      [theme.breakpoints.down("sm")]: theme.typography.h6,
    },

    stepper: {
      padding: 0,
      background: "none",
      marginRight: theme.spacing(-10 / 8),

      marginBottom: theme.spacing(-0.5),
      [theme.breakpoints.down("sm")]: { marginBottom: theme.spacing(-0.75) },
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

    content: {
      padding: "0 var(--spacing-modal)",
      margin: "0 calc(var(--spacing-modal) * -1)",

      ...theme.typography.body1,

      // https://codepen.io/evank/pen/wWbRNO
      background: `
        linear-gradient(
          var(--bg-paper) 50%,
          ${fade(theme.palette.background.paper, 0)}
        ),
        linear-gradient(
          ${fade(theme.palette.background.paper, 0)},
          var(--bg-paper) 50%
        ) 0 100%,
        linear-gradient(
          to top, ${theme.palette.divider} 1px,
          ${fade(theme.palette.divider, 0)}
        ),
        linear-gradient(to top,
          ${theme.palette.divider} 1px,
          ${fade(theme.palette.divider, 0)}
        ) 0 calc(100% - 0.5px)`,
      backgroundRepeat: "no-repeat",
      backgroundColor: "var(--bg-paper)",
      backgroundSize: "100% 2px, 100% 3px, 100% 1px, 100% 1px",
      backgroundAttachment: "local, local, scroll, scroll",

      "&:last-child": {
        marginBottom: "calc(var(--spacing-modal-contents) * -1)",
        paddingBottom: "var(--spacing-modal-contents)",
      },

      "& > * + *": { marginTop: "var(--spacing-modal-contents)" },
    },

    actions: {
      paddingTop: "var(--spacing-modal-contents)",
      "& button": { minWidth: 100 },
    },
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
      TransitionComponent={SlideTransitionMui}
      aria-labelledby="wizard-title"
      aria-describedby="wizard-step-description"
      fullWidth
      maxWidth="md"
      disableBackdropClick
      fullScreen={isXs}
      {...props}
      classes={{
        root: clsx(classes.root, props.classes?.root),
        paper: clsx(classes.paper, props.classes?.paper),
        ...(props.classes ?? {}),
      }}
    >
      <IconButton
        aria-label="Close"
        onClick={props.onClose as any}
        className={classes.closeButton}
        color="secondary"
      >
        <CloseIcon />
      </IconButton>

      <Grid
        container
        spacing={3}
        alignItems="flex-end"
        className={classes.titleRow}
      >
        <Grid item xs>
          <DialogTitle
            color="textPrimary"
            id="wizard-title"
            disableTypography
            className={classes.titleContainer}
          >
            <Typography
              className={classes.title}
              component="h2"
              color="textPrimary"
            >
              {title}
              {currentStep.title && `: ${currentStep.title}`}
            </Typography>
          </DialogTitle>
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

      <DialogContent className={classes.content}>
        {currentStep.description && (
          <Typography
            color="textSecondary"
            id="wizard-step-description"
            component={
              typeof currentStep.description === "string" ? "p" : "div"
            }
          >
            {currentStep.description}
          </Typography>
        )}

        {currentStep.content}
      </DialogContent>

      <Grid
        container
        spacing={2}
        justify="center"
        alignItems="center"
        className={classes.actions}
      >
        <Grid item>
          <Button onClick={handleBack}>{step > 0 ? "Back" : "Cancel"}</Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
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
