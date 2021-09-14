import { Paper, Typography, LinearProgress } from "@mui/material";
import { alpha } from "@mui/material/styles";
import BrandedBackground from "assets/BrandedBackground";
import Logo from "assets/Logo";

import { useAppContext } from "contexts/AppContext";
import { homepage } from "@root/package.json";

export interface IAuthLayoutProps {
  children: React.ReactNode;
  loading?: boolean;
}

export default function AuthLayout({ children, loading }: IAuthLayoutProps) {
  const { projectId } = useAppContext();

  return (
    <>
      <BrandedBackground />

      <Paper
        component="main"
        elevation={4}
        sx={
          {
            position: "relative",
            overflow: "hidden",

            maxWidth: 400,
            width: "100%",
            p: 4,

            backgroundColor: (theme) =>
              alpha(theme.palette.background.paper, 0.5),
            backdropFilter: "blur(20px) saturate(150%)",

            "--spacing-contents": (theme) => theme.spacing(4),
            "& > * + *": { marginTop: "var(--spacing-contents)" },

            textAlign: "center",
          } as any
        }
      >
        <a href={homepage} target="_blank" rel="noopener noreferrer">
          <Logo />
        </a>
        <Typography variant="body2" color="text.disabled" display="block">
          Project: <span style={{ userSelect: "all" }}>{projectId}</span>
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
