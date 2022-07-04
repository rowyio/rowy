import { useState, useRef } from "react";

import {
  IconButton,
  IconButtonProps,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Grow,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/HelpOutline";
import DocsIcon from "@mui/icons-material/LibraryBooksOutlined";
import { Discord as DiscordIcon } from "@src/assets/icons";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";

import { EXTERNAL_LINKS } from "@src/constants/externalLinks";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import { analytics } from "analytics";

export default function UserMenu(props: IconButtonProps) {
  const anchorEl = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const externalLinkIcon = (
    <ListItemSecondaryAction sx={{ right: 10, color: "text.disabled" }}>
      <InlineOpenInNewIcon />
    </ListItemSecondaryAction>
  );

  return (
    <>
      <Grow in>
        <IconButton
          aria-label="Open help menu"
          aria-controls="help-menu"
          aria-haspopup="true"
          size="large"
          {...props}
          ref={anchorEl}
          onClick={() => {
            setOpen(true);
            analytics.logEvent("open_help_menu");
          }}
        >
          <HelpIcon />
        </IconButton>
      </Grow>

      <Menu
        anchorEl={anchorEl.current}
        id="help-menu"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={() => setOpen(false)}
        sx={{ "& .MuiPaper-root": { minWidth: 160 } }}
      >
        <MenuItem
          component="a"
          href={EXTERNAL_LINKS.docs}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          <ListItemIcon>
            <DocsIcon />
          </ListItemIcon>
          Docs
          {externalLinkIcon}
        </MenuItem>

        <Divider variant="middle" sx={{ mt: 0.5, mb: 0.5 }} />

        <MenuItem
          component="a"
          href={EXTERNAL_LINKS.discord}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          <ListItemIcon>
            <DiscordIcon />
          </ListItemIcon>
          Discord
          {externalLinkIcon}
        </MenuItem>
        <MenuItem
          component="a"
          href={EXTERNAL_LINKS.gitHub}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          <ListItemIcon>
            <GitHubIcon />
          </ListItemIcon>
          GitHub
          {externalLinkIcon}
        </MenuItem>
        <MenuItem
          component="a"
          href={EXTERNAL_LINKS.twitter}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          <ListItemIcon>
            <TwitterIcon />
          </ListItemIcon>
          Twitter
          {externalLinkIcon}
        </MenuItem>
      </Menu>
    </>
  );
}
