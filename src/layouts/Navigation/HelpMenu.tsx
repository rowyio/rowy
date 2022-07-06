import {
  Menu,
  MenuProps,
  MenuItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
} from "@mui/material";
import DocsIcon from "@mui/icons-material/LibraryBooksOutlined";
import { Discord as DiscordIcon } from "@src/assets/icons";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";

import { EXTERNAL_LINKS } from "@src/constants/externalLinks";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import { analytics } from "analytics";

export default function HelpMenu({
  anchorEl,
  onClose,
}: Pick<MenuProps, "anchorEl" | "onClose">) {
  // useEffect(() => {
  // analytics.logEvent("open_help_menu");
  // }, []);

  const externalLinkIcon = (
    <ListItemSecondaryAction sx={{ right: 10, color: "text.disabled" }}>
      <InlineOpenInNewIcon />
    </ListItemSecondaryAction>
  );

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      id="help-menu"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      sx={{ "& .MuiPaper-root": { mt: 0.5, minWidth: 160 } }}
    >
      <MenuItem
        component="a"
        href={EXTERNAL_LINKS.discord}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose as any}
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
        onClick={onClose as any}
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
        onClick={onClose as any}
      >
        <ListItemIcon>
          <TwitterIcon />
        </ListItemIcon>
        Twitter
        {externalLinkIcon}
      </MenuItem>
    </Menu>
  );
}
