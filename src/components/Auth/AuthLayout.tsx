import Helmet from "react-helmet";
import { use100vh } from "react-div-100vh";

import { useTheme, Paper, Typography, LinearProgress } from "@material-ui/core";
import { alpha } from "@material-ui/core/styles";

import bgPattern from "assets/bg-pattern.svg";
import bgPatternDark from "assets/bg-pattern-dark.svg";
import Logo from "assets/Logo";

export interface IAuthLayoutProps {
  children: React.ReactNode;
  loading?: boolean;
}

export default function AuthLayout({ children, loading }: IAuthLayoutProps) {
  const theme = useTheme();
  const fullScreenHeight = use100vh() ?? "100vh";

  return (
    <>
      <Helmet>
        <style type="text/css">
          {`
          body {
            background-blend-mode: ${
              // prettier-ignore
              [
                "normal",
                "normal",
                "normal",

                "overlay",

                "normal",
                "normal",
              ].join(", ")
            };
            background-size: ${
              // prettier-ignore
              [
                "100%",
                "100%",
                "100%",

                `${480 * 10 / 14}px`,

                "100%",
                "100%",
              ].join(", ")
            };
            background-image: ${
              // prettier-ignore
              [
                `radial-gradient(circle   at  85% 100%, ${theme.palette.background.paper} 20%, ${alpha(theme.palette.background.paper, 0)})`,
                `radial-gradient(80%  80% at  15% 100%, ${alpha("#FA0", 0.1)} 25%, ${alpha("#F0A", 0.1)} 50%, ${alpha("#F0A", 0)} 100%)`,
                `linear-gradient(to top, ${alpha(theme.palette.background.paper, 1)}, ${alpha(theme.palette.background.paper, 0)})`,

                `url('${theme.palette.mode==="dark" ? bgPatternDark : bgPattern}')`,

                `radial-gradient(60% 180% at 100%  15%, ${alpha("#0FA", 0.3)} 25%, ${alpha("#0AF", 0.2)} 50%, ${alpha("#0AF", 0)} 100%)`,
                `linear-gradient(${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.primary.main, 0.2)})`,
              ].join(", ")
            };
          }
          
          #root {
            display: grid;
            place-items: center;
            padding: ${theme.spacing(1)};
            cursor: default;
            min-height: ${
              fullScreenHeight > 0 ? `${fullScreenHeight}px` : "100vh"
            };
          }
          `}
        </style>
      </Helmet>

      <Paper
        component="main"
        elevation={8}
        sx={
          {
            position: "relative",
            overflow: "hidden",

            maxWidth: 400,
            width: "100%",
            p: 4,

            "--spacing-contents": (theme) => theme.spacing(4),
            "& > * + *": { marginTop: "var(--spacing-contents)" },

            textAlign: "center",
          } as any
        }
      >
        <Logo />
        <Typography variant="body2" color="text.disabled" display="block">
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
    </>
  );
}
