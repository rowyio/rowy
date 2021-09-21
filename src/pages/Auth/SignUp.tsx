import { useLocation } from "react-router-dom";
import queryString from "query-string";

import { useMediaQuery, Stack, Paper, Typography, Button } from "@mui/material";
import { alpha } from "@mui/material/styles";
import DiscordIcon from "assets/icons/Discord";
import TwitterIcon from "@mui/icons-material/Twitter";

import Logo from "assets/Logo";
import AuthLayout from "components/Auth/AuthLayout";
import FirebaseUi from "components/Auth/FirebaseUi";
import { homepage } from "@root/package.json";

export default function SignUpPage() {
  const { search } = useLocation();
  const parsed = queryString.parse(search);

  const uiConfig: firebaseui.auth.Config = {};
  if (typeof parsed.redirect === "string" && parsed.redirect.length > 0) {
    uiConfig.signInSuccessUrl = parsed.redirect;
  }

  return (
    <Stack direction="row">
      <Paper
        elevation={4}
        square
        sx={{
          display: { xs: "none", md: "block" },

          width: 520,
          gridColumn: 1,
          gridRow: "1 / 4",

          backgroundColor: (theme) =>
            alpha(theme.palette.background.paper, 0.5),
          backdropFilter: "blur(20px) saturate(150%)",

          pt: (theme) => `max(env(safe-area-inset-top), ${theme.spacing(8)})`,
          pb: (theme) =>
            `max(env(safe-area-inset-bottom), ${theme.spacing(8)})`,
          pl: (theme) => `max(env(safe-area-inset-left), ${theme.spacing(8)})`,
          pr: 8,
        }}
      >
        <Stack
          direction="column"
          justifyContent="space-between"
          spacing={4}
          style={{ height: "100%" }}
        >
          <a href={homepage} target="_blank" rel="noopener noreferrer">
            <Logo size={2} />
          </a>

          <div>
            <Typography
              component="p"
              variant="h5"
              sx={{ fontWeight: "normal", fontSize: 28 / 16 + "rem" }}
              paragraph
            >
              Manage Firestore data in a spreadsheet-like&nbsp;UI
            </Typography>
            <Typography
              component="p"
              variant="h5"
              sx={{ fontWeight: "normal", fontSize: 28 / 16 + "rem" }}
              paragraph
            >
              Write Cloud Functions effortlessly&nbsp;in the browser
            </Typography>
            <Typography
              component="p"
              variant="h5"
              sx={{ fontWeight: "normal", fontSize: 28 / 16 + "rem" }}
              paragraph
            >
              Connect to your favorite third&nbsp;party platforms
            </Typography>
          </div>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<DiscordIcon color="action" />}
            >
              Join our Community
            </Button>
            <Button
              variant="outlined"
              startIcon={<TwitterIcon color="action" />}
            >
              Follow on Twitter
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <div style={{ flexGrow: 1 }}>
        <AuthLayout
          hideLogo
          title="Sign Up"
          description={
            <>
              Welcome! To join this project, sign in with the email address
              {parsed.email ? (
                <>
                  : <b style={{ userSelect: "all" }}>{parsed.email}</b>
                </>
              ) : (
                " used to invite you."
              )}
            </>
          }
        >
          <FirebaseUi uiConfig={uiConfig} />
        </AuthLayout>
      </div>
    </Stack>
  );
}
