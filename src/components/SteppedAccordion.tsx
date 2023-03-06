import { useState } from "react";

import {
  Stepper,
  StepperProps,
  Step,
  StepProps,
  StepButton,
  StepButtonProps,
  StepLabel,
  StepLabelProps,
  Typography,
  StepContent,
  StepContentProps,
} from "@mui/material";
import ExpandIcon from "@mui/icons-material/KeyboardArrowDown";

export interface ISteppedAccordionProps extends Partial<StepperProps> {
  steps: {
    id: string;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    optional?: boolean;
    content: React.ReactNode;
    error?: boolean;

    stepProps?: Partial<StepProps>;
    labelButtonProps?: Partial<StepButtonProps>;
    labelProps?: Partial<StepLabelProps>;
    contentProps?: Partial<StepContentProps>;
  }[];
  disableUnmount?: boolean;
}

export default function SteppedAccordion({
  steps,
  disableUnmount,
  ...props
}: ISteppedAccordionProps) {
  const [activeStep, setActiveStep] = useState(steps[0].id);

  return (
    <Stepper
      nonLinear
      activeStep={steps.findIndex((x) => x.id === activeStep)}
      orientation="vertical"
      {...props}
      sx={{
        mt: 0,

        "& .MuiStepLabel-root": { width: "100%" },
        "& .MuiStepLabel-label": {
          display: "flex",
          width: "100%",
          typography: "subtitle2",
          "&.Mui-active": { typography: "subtitle2" },
        },
        "& .MuiStepLabel-label svg": {
          display: "block",
          marginLeft: "auto",
          my: ((24 - 18) / 2 / 8) * -1,
          transition: (theme) => theme.transitions.create("transform"),
        },
        "& .Mui-active svg": {
          transform: "rotate(180deg)",
        },

        ...props.sx,
      }}
    >
      {steps.map(
        ({
          id,
          title,
          subtitle,
          optional,
          content,
          error,
          stepProps,
          labelButtonProps,
          labelProps,
          contentProps,
        }) => (
          <Step key={id} {...stepProps}>
            <StepButton
              onClick={() => setActiveStep((s) => (s === id ? "" : id))}
              optional={
                subtitle ||
                (optional && (
                  <Typography variant="caption">Optional</Typography>
                ))
              }
              {...labelButtonProps}
            >
              <StepLabel
                error={error}
                {...labelProps}
                StepIconProps={{
                  sx: {
                    "&.Mui-active": {
                      transform: "rotate(0deg) !important",
                    },
                  },
                }}
              >
                {title}
                {content && <ExpandIcon sx={{ mr: -0.5 }} />}
              </StepLabel>
            </StepButton>

            {content && (
              <StepContent
                TransitionProps={
                  disableUnmount ? { unmountOnExit: false } : undefined
                }
                {...contentProps}
              >
                {content}
              </StepContent>
            )}
          </Step>
        )
      )}
    </Stepper>
  );
}
