import { Link } from "react-router-dom";

import {
  ListItem,
  ListItemButton,
  Typography,
  IconButton,
} from "@mui/material";
import GoIcon from "@mui/icons-material/ArrowForward";

import { Table } from "@src/contexts/ProjectContext";

export interface ITableListItemProps extends Table {
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
        }}
      >
        {/* <Typography
          variant="overline"
          component="p"
          noWrap
          color="textSecondary"
          sx={{ maxWidth: 100, flexShrink: 0, flexGrow: 1, mr: 2 }}
        >
          {section}
        </Typography> */}
        <Typography
          component="h3"
          variant="button"
          noWrap
          sx={{ maxWidth: 160, flexShrink: 0, flexGrow: 1, mr: 2 }}
        >
          {name}
        </Typography>
        <Typography color="textSecondary" noWrap>
          {description}
        </Typography>
      </ListItemButton>

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
