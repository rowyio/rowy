import {
  Paper,
  Typography,
  LinearProgress,
  Stack,
  Link,
  LinkProps,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import BrandedBackground, { Wrapper } from "@src/assets/BrandedBackground";
import Logo from "@src/assets/Logo";

import { useAppContext } from "@src/contexts/AppContext";
import { EXTERNAL_LINKS } from "@src/constants/externalLinks";

export interface IAuthLayoutProps {
  hideLogo?: boolean;
  hideProject?: boolean;
  hideLinks?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
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
  const { projectId } = useAppContext();

  const linkProps: LinkProps = {
    variant: "caption",
    color: "text.secondary",
    underline: "hover",
    target: "_blank",
    rel: "noopener noreferrer",
  };

  return (
    <Wrapper sx={hideLogo ? { gap: (theme) => theme.spacing(2) } : {}}>
      <BrandedBackground />

      <div
        style={{
          textAlign: "center",
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
          sx={{ pt: 1, display: hideProject ? "none" : "block" }}
        >
          Project: <span style={{ userSelect: "all" }}>{projectId}</span>
        </Typography>
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
    </Wrapper>
  );
}
