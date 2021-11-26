import { useState } from "react";

import {
  Stepper,
  StepperProps,
  Step,
  StepProps,
  StepButton,
  StepButtonProps,
  Typography,
  StepContent,
  StepContentProps,
} from "@mui/material";
import ExpandIcon from "@mui/icons-material/KeyboardArrowDown";

export interface ISteppedAccordionProps extends Partial<StepperProps> {
  steps: {
    id: string;
    title: React.ReactNode;
    optional?: boolean;
    content: React.ReactNode;

    stepProps?: Partial<StepProps>;
    titleProps?: Partial<StepButtonProps>;
    contentProps?: Partial<StepContentProps>;
  }[];
}

export default function SteppedAccordion({
  steps,
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
          optional,
          content,
          stepProps,
          titleProps,
          contentProps,
        }) => (
          <Step key={id} {...stepProps}>
            <StepButton
              onClick={() => setActiveStep((s) => (s === id ? "" : id))}
              optional={
                optional && <Typography variant="caption">Optional</Typography>
              }
              {...titleProps}
            >
              {title}
              <ExpandIcon />
            </StepButton>

            <StepContent {...contentProps}>{content}</StepContent>
          </Step>
        )
      )}
    </Stepper>
  );
}
