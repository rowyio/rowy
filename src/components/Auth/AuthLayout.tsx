import { use100vh } from "react-div-100vh";

import { Box, Paper, Typography, LinearProgress } from "@material-ui/core";
import { alpha } from "@material-ui/core/styles";

import bgPattern from "assets/bg-pattern.svg";
import Logo from "assets/Logo";

export interface IAuthLayoutProps {
  children: React.ReactNode;
  loading?: boolean;
}

export default function AuthLayout({ children, loading }: IAuthLayoutProps) {
  const fullScreenHeight = use100vh() ?? "100vh";

  return (
    <Box
      sx={{
        minHeight: fullScreenHeight,
        backgroundBlendMode: "normal, overlay, normal, normal",
        // backgroundImage: `
        //   linear-gradient(to bottom, rgba(255,255,255,0), #fff),
        //   linear-gradient(155deg, #303030 -4%, ${theme.palette.primary.main} 92%),
        //   url('${bgPattern}'),
        //   linear-gradient(161deg, #ecf4ff -31%, #fff4f4 160%)
        // `,
        backgroundImage: (theme) => `
      linear-gradient(to bottom, ${alpha(
        theme.palette.background.default,
        0
      )}, ${theme.palette.background.default} 75%),
      linear-gradient(155deg, ${theme.palette.primary.main} 10%, ${
          theme.palette.secondary.main
        } 90%),
      url('${bgPattern}'),
      linear-gradient(161deg, ${alpha(
        theme.palette.background.default,
        0.95
      )} -31%, ${alpha(theme.palette.background.default, 0.98)} 160%)
    `,

        display: "grid",
        placeItems: "center",
        p: 1,

        cursor: "default",
      }}
    >
      <Paper
        component="main"
        sx={
          {
            position: "relative",
            overflow: "hidden",

            maxWidth: 400,
            width: "100%",
            p: 4,
            bgcolor: "background.paper",

            "--spacing-contents": (theme) => theme.spacing(4),
            "& > * + *": { marginTop: "var(--spacing-contents)" },

            textAlign: "center",
          } as any
        }
      >
        <Logo />
        <Typography
          variant="body2"
          sx={{
            display: "block",
            mt: 1,

            color: "text.disabled",
          }}
        >
          Project: {process.env.REACT_APP_FIREBASE_PROJECT_ID}
        </Typography>
        {children}

        {loading && (
          <LinearProgress
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              marginTop: 0,
            }}
          />
        )}
      </Paper>
    </Box>
  );
}
