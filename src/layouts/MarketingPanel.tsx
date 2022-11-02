import { Stack, Paper, Typography, Button } from "@mui/material";
import { Discord as DiscordIcon } from "@src/assets/icons";
import TwitterIcon from "@mui/icons-material/Twitter";

import Logo from "@src/assets/Logo";
import { EXTERNAL_LINKS } from "@src/constants/externalLinks";

export default function Marketing() {
  return (
    <Paper
      elevation={0}
      square
      sx={{
        display: { xs: "none", md: "block" },

        width: 520,
        gridColumn: 1,
        gridRow: "1 / 4",

        bgcolor: "background.default",

        pt: (theme) => `max(env(safe-area-inset-top), ${theme.spacing(8)})`,
        pb: (theme) => `max(env(safe-area-inset-bottom), ${theme.spacing(8)})`,
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
        <a
          href={EXTERNAL_LINKS.homepage}
          target="_blank"
          rel="noopener noreferrer"
        >
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
            href={EXTERNAL_LINKS.discord}
            target="_blank"
            rel="noopener noreferrer"
          >
            Join our community
          </Button>
          <Button
            variant="outlined"
            startIcon={<TwitterIcon color="action" />}
            href={EXTERNAL_LINKS.twitter}
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow on Twitter
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
