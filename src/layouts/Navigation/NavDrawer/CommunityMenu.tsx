import { useEffect } from "react";

import {
  Menu,
  MenuProps,
  ListSubheader,
  MenuItem,
  ListItemIcon,
  ListItemSecondaryAction,
} from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import SocialLogo from "@src/components/SocialLogo";

import { EXTERNAL_LINKS } from "@src/constants/externalLinks";
import { logEvent, analytics } from "analytics";

export default function HelpMenu({
  anchorEl,
  onClose,
}: Pick<MenuProps, "anchorEl" | "onClose">) {
  const open = Boolean(anchorEl);
  useEffect(() => {
    if (open) logEvent(analytics, "open_community_menu");
  }, [open]);

  const externalLinkIcon = (
    <ListItemSecondaryAction sx={{ right: 10, color: "text.disabled" }}>
      <InlineOpenInNewIcon />
    </ListItemSecondaryAction>
  );

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      id="community-menu"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      sx={{ "& .MuiPaper-root": { mt: 1.5, py: 1 } }}
      PaperProps={{ elevation: 12 }}
    >
      <ListSubheader
        sx={{
          pb: 0.5,
          typography: "subtitle1",
        }}
      >
        Join our community
      </ListSubheader>
      <ListSubheader
        sx={{
          pb: 1.5,
          maxWidth: 260,
          typography: "body2",
          color: "text.secondary",
        }}
      >
        Reach out for help, engage with our community, or shout us out!
      </ListSubheader>

      <MenuItem
        component="a"
        href={EXTERNAL_LINKS.discord}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose as any}
      >
        <ListItemIcon sx={{ mr: 1 }}>
          <SocialLogo platform="discord" />
        </ListItemIcon>
        Discord
        {externalLinkIcon}
      </MenuItem>
      <MenuItem
        component="a"
        href={EXTERNAL_LINKS.gitHub}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose as any}
      >
        <ListItemIcon sx={{ mr: 1 }}>
          <SocialLogo platform="gitHub" />
        </ListItemIcon>
        GitHub
        {externalLinkIcon}
      </MenuItem>
      <MenuItem
        component="a"
        href={EXTERNAL_LINKS.twitter}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose as any}
      >
        <ListItemIcon sx={{ mr: 1 }}>
          <SocialLogo platform="twitter" />
        </ListItemIcon>
        Twitter
        {externalLinkIcon}
      </MenuItem>
      <MenuItem
        component="a"
        href={EXTERNAL_LINKS.productHunt}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose as any}
      >
        <ListItemIcon sx={{ mr: 1 }}>
          <SocialLogo platform="productHunt" />
        </ListItemIcon>
        Product Hunt
        {externalLinkIcon}
      </MenuItem>
    </Menu>
  );
}
