import { useEffect } from "react";

import {
  Menu,
  MenuProps,
  MenuItem,
  ListItemSecondaryAction,
  Divider,
  ListItem,
  ListItemText,
} from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import { EXTERNAL_LINKS, WIKI_LINKS } from "@src/constants/externalLinks";
import { logEvent, analytics } from "analytics";
import meta from "@root/package.json";

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
      sx={{ "& .MuiPaper-root": { mt: 1.5 } }}
      PaperProps={{ elevation: 12 }}
    >
      <MenuItem
        component="a"
        href={EXTERNAL_LINKS.gitHub + "/discussions"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose as any}
      >
        Get support
        {externalLinkIcon}
      </MenuItem>

      <MenuItem
        component="a"
        href={WIKI_LINKS.faqs}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose as any}
      >
        FAQs
        {externalLinkIcon}
      </MenuItem>

      <MenuItem
        component="a"
        href={EXTERNAL_LINKS.gitHub + "/issues/new/choose"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose as any}
      >
        Feature requests
        {externalLinkIcon}
      </MenuItem>

      <Divider variant="middle" />

      <ListItem>
        <ListItemText
          primary={`Rowy v${meta.version}`}
          primaryTypographyProps={{ color: "text.disabled" }}
        />
      </ListItem>
    </Menu>
  );
}
