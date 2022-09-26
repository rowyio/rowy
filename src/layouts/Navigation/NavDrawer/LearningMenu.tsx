import { useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Menu,
  MenuProps,
  MenuItem,
  ListItemSecondaryAction,
} from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import { ChevronRight as ChevronRightIcon } from "@src/assets/icons";

import { EXTERNAL_LINKS, WIKI_LINKS } from "@src/constants/externalLinks";
import { ROUTES } from "@src/constants/routes";
import { logEvent, analytics } from "analytics";

export default function LearningMenu({
  anchorEl,
  onClose,
}: Pick<MenuProps, "anchorEl" | "onClose">) {
  const open = Boolean(anchorEl);
  useEffect(() => {
    if (open) logEvent(analytics, "open_learning_menu");
  }, [open]);

  const externalLinkIcon = (
    <ListItemSecondaryAction
      sx={{
        position: "relative",
        transform: "none",
        ml: "auto",
        pl: 2,
        color: "text.disabled",
        right: -2,
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
      id="learning-menu"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      sx={{ "& .MuiPaper-root": { mt: 1.5 } }}
      PaperProps={{ elevation: 12 }}
    >
      <MenuItem
        component="a"
        href={WIKI_LINKS.howTo}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose as any}
      >
        How-to guides
        {externalLinkIcon}
      </MenuItem>

      <MenuItem
        component={Link}
        to={ROUTES.tableTutorial}
        onClick={onClose as any}
      >
        Table tutorial
        <ListItemSecondaryAction sx={{ color: "text.disabled", height: 20 }}>
          <ChevronRightIcon />
        </ListItemSecondaryAction>
      </MenuItem>

      <MenuItem
        component="a"
        href={EXTERNAL_LINKS.welcomeVideo}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose as any}
      >
        Video tutorials
        {externalLinkIcon}
      </MenuItem>
    </Menu>
  );
}
