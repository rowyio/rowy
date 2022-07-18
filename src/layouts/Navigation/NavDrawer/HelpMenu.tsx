import { useEffect } from "react";

import {
  Menu,
  MenuProps,
  ListSubheader,
  MenuItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
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
    if (open) logEvent(analytics, "open_help_menu");
  }, [open]);

  const externalLinkIcon = (
    <ListItemSecondaryAction
      sx={{
        position: "static",
        transform: "none",
        ml: "auto",
        pl: 2,
        color: "text.disabled",
      }}
    >
      <InlineOpenInNewIcon />
    </ListItemSecondaryAction>
  );

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      id="help-menu"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      sx={{ "& .MuiPaper-root": { mt: 1.5, py: 1 } }}
      PaperProps={{ elevation: 10 }}
    >
      <ListSubheader
        sx={{
          mb: 0.5,
          typography: "subtitle1",
        }}
      >
        Get support
      </ListSubheader>
      <ListSubheader
        sx={{
          mb: 1.5,
          maxWidth: 260,
          typography: "body2",
          color: "text.secondary",
        }}
      >
        Reach out for help and find FAQs on GitHub Discussions
      </ListSubheader>

      <MenuItem
        component="a"
        href={EXTERNAL_LINKS.gitHub + "/discussions"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose as any}
      >
        <ListItemIcon sx={{ mr: 1 }}>
          <SocialLogo platform="gitHub" />
        </ListItemIcon>
        GitHub Discussions
        {externalLinkIcon}
      </MenuItem>

      <Divider variant="middle" />

      <MenuItem
        component="a"
        href={EXTERNAL_LINKS.gitHub + "/issues/new/choose"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose as any}
      >
        <ListItemIcon sx={{ mr: 1 }}>
          <SocialLogo platform="gitHub" />
        </ListItemIcon>
        Feature request
        {externalLinkIcon}
      </MenuItem>
    </Menu>
  );
}
