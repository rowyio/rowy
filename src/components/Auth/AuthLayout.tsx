import {
  Paper,
  Typography,
  LinearProgress,
  Stack,
  Link,
  LinkProps,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import BrandedBackground from "assets/BrandedBackground";
import Logo from "assets/Logo";

import { useAppContext } from "contexts/AppContext";
import { homepage } from "@root/package.json";

export interface IAuthLayoutProps {
  hideLogo?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
}

export default function AuthLayout({
  hideLogo,
  title,
  description,
  children,
  loading,
}: IAuthLayoutProps) {
  const { projectId } = useAppContext();

  const linkProps: LinkProps = {
    variant: "caption",
    color: "text.secondary",
    underline: "hover",
    target: "_blank",
    rel: "noopener noreferrer",
  };

  return (
    <div className="wrapper">
      <BrandedBackground />

      <div
        style={{
          textAlign: "center",
          marginBottom: -8,
          visibility: hideLogo ? "hidden" : "visible",
        }}
      >
        <a href={homepage} target="_blank" rel="noopener noreferrer">
          <Logo />
        </a>
      </div>

      <Paper
        component="main"
        elevation={4}
        sx={
          {
            position: "relative",
            overflow: "hidden",

            maxWidth: 360,
            width: "100%",
            px: 4,
            py: 3,
            minHeight: 300,

            backgroundColor: (theme) =>
              alpha(theme.palette.background.paper, 0.5),
            backdropFilter: "blur(20px) saturate(150%)",

            display: "flex",
            flexDirection: "column",
            textAlign: "center",

            "& > :not(style) + :not(style)": { mt: 6 },
          } as any
        }
      >
        {title && (
          <Typography component="h1" variant="h4">
            {title}
          </Typography>
        )}
        {description && (
          <Typography variant="body1" style={{ marginTop: 8 }}>
            {description}
          </Typography>
        )}

        <Stack
          spacing={4}
          justifyContent="center"
          alignItems="center"
          style={{ textAlign: "center", flexGrow: 1 }}
        >
          {children}
        </Stack>

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

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          textAlign="center"
          sx={{ pt: 1 }}
        >
          Project: <span style={{ userSelect: "all" }}>{projectId}</span>
        </Typography>
      </Paper>

      <Stack
        spacing={1.25}
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        style={{ maxWidth: 360, width: "100%", padding: "0 4px" }}
      >
        <Link href={homepage} {...linkProps}>
          {homepage.split("//").pop()?.replace(/\//g, "")}
        </Link>
        <Link href={homepage} {...linkProps}>
          Discord
        </Link>
        <Link href={homepage} {...linkProps}>
          Twitter
        </Link>

        <div style={{ flexGrow: 1, marginLeft: 0 }} />

        <Link href={homepage} {...linkProps}>
          Docs
        </Link>
        <Link href={homepage} {...linkProps}>
          Privacy
        </Link>
        <Link href={homepage} {...linkProps}>
          Terms
        </Link>
      </Stack>
    </div>
  );
}
