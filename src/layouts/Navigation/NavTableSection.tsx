import { useState } from "react";
import { useLocation } from "react-router-dom";

import { List, ListItemIcon, ListItemText, Collapse } from "@mui/material";
import FolderIcon from "@mui/icons-material/FolderOutlined";
import FavoriteIcon from "@mui/icons-material/FavoriteBorder";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NavItem from "./NavItem";

import { TableSettings } from "@src/types/table";
import { ROUTES } from "@src/constants/routes";

const getTableRoute = (table: TableSettings) =>
  `${ROUTES.table}/${table.id.replace(/\//g, "~2F")}`;

export interface INavTableSectionProps {
  section: string;
  tables: TableSettings[];
  closeDrawer?: (e: {}) => void;
}

export default function NavTableSection({
  section,
  tables,
  closeDrawer,
}: INavTableSectionProps) {
  const { pathname } = useLocation();
  const hasMatch = tables.map(getTableRoute).includes(pathname);

  const [open, setOpen] = useState(hasMatch);
  const isFavorites = section === "Favorites";

  return (
    <li>
      <NavItem
        {...({ component: "button" } as any)}
        selected={!isFavorites && hasMatch && !open}
        onClick={() => setOpen((o) => !o)}
      >
        <ListItemIcon>
          {isFavorites ? <FavoriteIcon /> : <FolderIcon />}
        </ListItemIcon>

        <ListItemText primary={section} style={{ textAlign: "left" }} />

        <ArrowDropDownIcon
          sx={{
            color: "action.active",
            mr: -0.5,
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: (theme) => theme.transitions.create("transform"),
          }}
        />
      </NavItem>

      <Collapse in={open}>
        <List style={{ paddingTop: 0 }}>
          {tables.map((table) => {
            const route = getTableRoute(table);

            return (
              <li key={table.id}>
                <NavItem
                  to={route}
                  selected={!isFavorites && pathname.split("%2F")[0] === route}
                  onClick={closeDrawer}
                >
                  <ListItemIcon />
                  <ListItemText
                    primary={table.name}
                    sx={{
                      "&& .MuiListItemText-primary": {
                        fontWeight: "normal",
                        fontSize: ".8125rem",
                      },
                    }}
                  />
                </NavItem>
              </li>
            );
          })}
        </List>
      </Collapse>
    </li>
  );
}
