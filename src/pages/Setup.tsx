import { useRouteMatch } from "react-router-dom";
import { use100vh } from "react-div-100vh";

import {
  useMediaQuery,
  Paper,
  Stepper,
  Step,
  StepLabel,
  MobileStepper,
  Typography,
  DialogActions,
  Button,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import BrandedBackground from "assets/BrandedBackground";
import ScrollableDialogContent from "components/Modal/ScrollableDialogContent";

import { useAppContext } from "contexts/AppContext";

export default function SetupPage() {
  const { params } = useRouteMatch<{ step: string }>();
  const fullScreenHeight = use100vh() ?? 0;
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

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
        }}
      >
        {isMobile ? (
          <MobileStepper
            variant="dots"
            steps={4}
            backButton={null}
            nextButton={null}
            position="static"
            sx={{
              background: "none",
              m: 1,
              mt: 1.25,
            }}
          />
        ) : (
          <Stepper
            sx={{
              mt: 2.5,
              mb: 3,
              "& .MuiStep-root:first-child": { pl: 0 },
              "& .MuiStep-root:last-child": { pr: 0 },
              userSelect: "none",
            }}
          >
            <Step>
              <StepLabel>Rowy Run</StepLabel>
            </Step>
            <Step>
              <StepLabel>Service Account</StepLabel>
            </Step>
            <Step>
              <StepLabel>Sign In</StepLabel>
            </Step>
            <Step>
              <StepLabel>Firestore Rules</StepLabel>
            </Step>
          </Stepper>
        )}

        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 1, typography: { xs: "h5", md: "h4" } }}
        >
          Set Up Rowy Run
        </Typography>

        <ScrollableDialogContent>
          <Typography variant="body1">
            Rowy Run is a Cloud Run instance.
          </Typography>
          <div style={{ height: "100vh" }}>content</div>
        </ScrollableDialogContent>

        <DialogActions>
          <Button variant="contained" color="primary">
            Get Started
          </Button>
        </DialogActions>
      </Paper>
    </>
  );
}
