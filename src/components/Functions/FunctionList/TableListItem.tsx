import { Link } from "react-router-dom";

import {
  ListItem,
  ListItemButton,
  Typography,
  IconButton,
} from "@mui/material";
import GoIcon from "@mui/icons-material/ArrowForward";

import RenderedMarkdown from "@src/components/RenderedMarkdown";
import { TableSettings } from "@src/types/table";

export interface ITableListItemProps extends TableSettings {
  link: string;
  actions?: React.ReactNode;
}

export default function TableListItem({
  // section,
  name,
  description,
  link,
  actions,
}: ITableListItemProps) {
  return (
    <ListItem disableGutters disablePadding>
      <ListItemButton
        component={Link}
        to={link}
        sx={{
          alignItems: "baseline",
          height: 48,
          py: 0,
          pr: 0,
          borderRadius: 2,
          "& > *": { lineHeight: "48px !important" },
          flexWrap: "nowrap",
          overflow: "hidden",

          flexBasis: 160 + 16,
          flexGrow: 0,
          flexShrink: 0,
          mr: 2,
        }}
      >
        <Typography component="h3" variant="button" noWrap>
          {name}
        </Typography>
      </ListItemButton>

      <Typography
        color="textSecondary"
        component="div"
        noWrap
        sx={{ flexGrow: 1, "& *": { display: "inline" } }}
      >
        {description && (
          <RenderedMarkdown
            children={description}
            restrictionPreset="singleLine"
          />
        )}
      </Typography>

      <div style={{ flexShrink: 0 }}>
        {actions}

        <IconButton
          size="large"
          color="primary"
          component={Link}
          to={link}
          sx={{ display: { xs: "none", sm: "inline-flex" } }}
        >
          <GoIcon />
        </IconButton>
      </div>
    </ListItem>
  );
}
