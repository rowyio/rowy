import { useState, Fragment } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";

import {
  Slide,
  Drawer,
  Typography,
  IconButton,
  Box,
  Stack,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import StepsProgress from "@src/components/StepsProgress";
import { TUTORIAL_STEPS } from "./Steps";

import {
  projectScope,
  confirmDialogAtom,
  navOpenAtom,
  updateUserSettingsAtom,
} from "@src/atoms/projectScope";
import { ROUTES } from "@src/constants/routes";
import {
  NAV_DRAWER_COLLAPSED_WIDTH,
  NAV_DRAWER_WIDTH,
} from "@src/layouts/Navigation/NavDrawer";

export default function TableTutorial() {
  const [navOpen] = useAtom(navOpenAtom, projectScope);
  const confirm = useSetAtom(confirmDialogAtom, projectScope);
  const [updateUserSettings] = useAtom(updateUserSettingsAtom, projectScope);
  const navigate = useNavigate();

  const [completed, setCompleted] = useState(
    new Array(TUTORIAL_STEPS.length).fill(false)
  );
  const [currentStep, setCurrentStep] = useState(0);

  const stepProps = TUTORIAL_STEPS[currentStep];
  const StepComponent = stepProps.StepComponent;
  const isFinal = currentStep === TUTORIAL_STEPS.length - 1;

  const handleComplete = (value: boolean) =>
    setCompleted((c) => {
      if (c[currentStep] === value) return c;
      const newCompleted = [...c];
      newCompleted[currentStep] = value;
      return newCompleted;
    });

  const handleNext = () => {
    if (isFinal) {
      if (updateUserSettings)
        updateUserSettings({ tableTutorialComplete: true });

      navigate(ROUTES.tables);
    } else {
      setCurrentStep((c) => Math.min(c + 1, TUTORIAL_STEPS.length - 1));
    }
  };

  return (
    <Slide in direction="up">
      <Drawer
        variant="permanent"
        anchor="bottom"
        sx={{
          position: "fixed",
          top: "auto",
          bottom: `env(safe-area-inset-bottom)`,
          left: {
            xs: `env(safe-area-inset-left)`,
            md: (navOpen ? NAV_DRAWER_WIDTH : NAV_DRAWER_COLLAPSED_WIDTH) + 8,
          },
          right: `env(safe-area-inset-right)`,
          height: "min(50vh, 440px)",

          "& .MuiPaper-root": {
            position: "static",
            height: "100%",

            borderRadius: 3,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            border: "none",

            px: { xs: 2, sm: 3, md: 6 },
            py: { xs: 3, md: 5 },
            pb: (theme) =>
              `max(env(safe-area-inset-bottom), ${theme.spacing(5)})`,
            overflow: "auto",

            display: "flex",
            flexDirection: "column",
            gap: 2,
          },

          "& ol": { m: 0, p: 0, listStyle: "none" },
          "& p": { maxWidth: "100ch" },
        }}
        PaperProps={{ elevation: 2 }}
      >
        <Typography variant="overline" sx={{ mb: -2 }}>
          Get started tutorial
        </Typography>

        <IconButton
          aria-label="Close tutorial"
          size="medium"
          sx={{
            marginLeft: "auto",
            width: 40,
            position: "absolute",
            top: 12,
            right: 12,
          }}
          onClick={() =>
            confirm({
              title: "Close tutorial?",
              body: "Your progress will be lost",
              handleConfirm: () => navigate(ROUTES.tables),
              confirm: "Close tutorial",
              cancel: "Continue tutorial",
              confirmColor: "error",
              buttonLayout: "vertical",
            })
          }
        >
          <CloseIcon />
        </IconButton>

        <Fragment key={TUTORIAL_STEPS[currentStep].id}>
          <header>
            <Typography variant="h5" component="h1" gutterBottom>
              {stepProps.title}
            </Typography>
            <Typography variant="body1">{stepProps.description}</Typography>
          </header>

          <div style={{ flexGrow: 1 }}>
            <StepComponent
              complete={completed[currentStep]}
              setComplete={handleComplete}
            />
          </div>

          {stepProps.completeText && (
            <Box
              sx={{
                visibility: completed[currentStep] ? "visible" : "hidden",
                opacity: completed[currentStep] ? 1 : 0,
                transition: (theme) => theme.transitions.create("opacity"),
              }}
            >
              {stepProps.completeText}
            </Box>
          )}
        </Fragment>

        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          gap={1}
        >
          <StepsProgress
            steps={TUTORIAL_STEPS.length}
            value={completed.filter(Boolean).length}
            style={{
              flexGrow: 0,
              flexShrink: 1,
              flexBasis: 200,
              marginRight: "auto",
            }}
          />

          <Button variant="text" style={{ flexShrink: 0 }}>
            I’m stuck
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ flexShrink: 0 }}
            disabled={!completed[currentStep]}
            onClick={handleNext}
            endIcon={isFinal ? <ArrowForwardIcon /> : undefined}
          >
            {isFinal ? "Finish" : "Next"}
          </Button>
        </Stack>
      </Drawer>
    </Slide>
  );
}
