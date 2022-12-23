import { Box, BoxProps, SvgIcon } from "@mui/material";
import { Discord as DiscordIcon } from "@src/assets/icons";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";

import { spreadSx } from "@src/utils/ui";

const SOCIAL_PLATFORMS = Object.freeze({
  discord: { bg: "#5865F2", fg: "#fff", icon: <DiscordIcon /> },
  gitHub: { bg: "#24292E", fg: "#fff", icon: <GitHubIcon /> },
  twitter: { bg: "#1d9bf0", fg: "#fff", icon: <TwitterIcon /> },
  productHunt: {
    bg: "#fff",
    fg: "#DA552F",
    icon: (
      <SvgIcon viewBox="0 0 240 240">
        <path d="M240 120c0 66.274-53.726 120-120 120S0 186.274 0 120 53.726 0 120 0s120 53.726 120 120m-104 0h-34V84h34c9.941 0 18 8.059 18 18 0 9.94-8.059 18-18 18m0-60H78v120h24v-36h34c23.196 0 42-18.804 42-42s-18.804-42-42-42" />
      </SvgIcon>
    ),
  },
});

export interface ISocialLogoProps extends Partial<BoxProps> {
  platform: keyof typeof SOCIAL_PLATFORMS;
}

export default function SocialLogo({ platform, ...props }: ISocialLogoProps) {
  return (
    <Box
      {...props}
      sx={[
        {
          borderRadius: 1.5,
          p: 0.5,
          bgcolor: SOCIAL_PLATFORMS[platform].bg,
          color: SOCIAL_PLATFORMS[platform].fg,
          boxShadow: (theme) => `0 0 0 1px ${
            theme.palette.action.inputOutline
          } inset,
          0 ${theme.palette.mode === "dark" ? "" : "-"}1px 0 0 ${
            theme.palette.action.inputOutline
          } inset`,

          "& svg": { display: "block" },
        },
        ...spreadSx(props.sx),
      ]}
    >
      {SOCIAL_PLATFORMS[platform].icon}
    </Box>
  );
}
