import { useAtom } from "jotai";
import { use100vh } from "react-div-100vh";

import {
  alpha,
  Box,
  Paper,
  Typography,
  LinearProgress,
  Stack,
  Link,
  LinkProps,
} from "@mui/material";
import Logo from "@src/assets/Logo";
import bgTableLight from "@src/assets/bg-table-light.webp";
import bgTableDark from "@src/assets/bg-table-dark.webp";

import { projectScope, projectIdAtom } from "@src/atoms/projectScope";
import { EXTERNAL_LINKS } from "@src/constants/externalLinks";

export interface IAuthLayoutProps {
  hideLogo?: boolean;
  hideProject?: boolean;
  hideLinks?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  loading?: boolean;
}

export default function AuthLayout({
  hideLogo,
  hideProject,
  hideLinks,
  title,
  description,
  children,
  loading,
}: IAuthLayoutProps) {
  const [projectId] = useAtom(projectIdAtom, projectScope);
  const fullScreenHeight = use100vh() ?? 0;

  const linkProps: LinkProps = {
    variant: "caption",
    color: "text.secondary",
    underline: "hover",
    target: "_blank",
    rel: "noopener noreferrer",
  };

  return (
    <Box
      sx={{
        backgroundImage: (theme) =>
          `linear-gradient(to bottom,
            ${alpha(theme.palette.background.default, 0.75)},
            ${alpha(theme.palette.background.default, 0.75)}),
            url(${theme.palette.mode === "dark" ? bgTableDark : bgTableLight})`,
        backgroundSize: { xs: "1920px 1080px", md: "cover" },
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top left",

        display: "grid",
        placeItems: "center",
        alignContent: "space-between",
        gap: 2,
        gridAutoRows: "max-content",
        minHeight: fullScreenHeight > 0 ? `${fullScreenHeight}px` : "100vh",

        pt: (theme) => `max(env(safe-area-inset-top), ${theme.spacing(2)})`,
        pb: (theme) => `max(env(safe-area-inset-bottom), ${theme.spacing(2)})`,
        pr: (theme) => `max(env(safe-area-inset-right), ${theme.spacing(1)})`,
        pl: (theme) => `max(env(safe-area-inset-left), ${theme.spacing(1)})`,
      }}
    >
      <div
        style={{
          marginBottom: -8,
          display: hideLogo && hideLinks ? "none" : "block",
          visibility: hideLogo ? "hidden" : "visible",
        }}
      >
        <a
          href={EXTERNAL_LINKS.homepage}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Logo size={2} />
        </a>
      </div>

      <Paper
        component="main"
        elevation={8}
        sx={
          {
            position: "relative",
            overflow: "hidden",

            maxWidth: 360,
            width: "100%",
            p: 4,
            minHeight: 300,
            borderRadius: 3,

            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",

            "& > :not(style) + :not(style)": { mt: 4 },
          } as any
        }
      >
        {title && (
          <Typography
            component="h1"
            variant="h4"
            align="center"
            sx={{ mt: -1 }}
          >
            {title}
          </Typography>
        )}
        {description && (
          <Typography variant="body1" align="center" style={{ marginTop: 8 }}>
            {description}
          </Typography>
        )}

        <Stack
          spacing={4}
          justifyContent="center"
          alignItems="flex-start"
          style={{ flexGrow: 1 }}
          margin="auto"
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

        {projectId && (
          <Typography
            variant="caption"
            color="text.disabled"
            align="center"
            sx={{ display: hideProject ? "none" : "block", mb: -0.5 }}
          >
            Project: <span style={{ userSelect: "all" }}>{projectId}</span>
          </Typography>
        )}
      </Paper>

      <Stack
        spacing={{ xs: 1.25, sm: 2 }}
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        style={{
          maxWidth: 360,
          width: "100%",
          padding: "0 4px",
          display: hideLogo && hideLinks ? "none" : "flex",
          visibility: hideLinks ? "hidden" : "visible",
        }}
      >
        <Link href={EXTERNAL_LINKS.homepage} {...linkProps}>
          {EXTERNAL_LINKS.homepage.split("//").pop()?.replace(/\//g, "")}
        </Link>
        <Link href={EXTERNAL_LINKS.discord} {...linkProps}>
          Discord
        </Link>
        <Link href={EXTERNAL_LINKS.twitter} {...linkProps}>
          Twitter
        </Link>

        <div style={{ flexGrow: 1, marginLeft: 0 }} />

        <Link href={EXTERNAL_LINKS.docs} {...linkProps}>
          Docs
        </Link>
        <Link href={EXTERNAL_LINKS.privacy} {...linkProps}>
          Privacy
        </Link>
        <Link href={EXTERNAL_LINKS.terms} {...linkProps}>
          Terms
        </Link>
      </Stack>
    </Box>
  );
}
