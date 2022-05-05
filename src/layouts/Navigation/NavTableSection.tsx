import { useState } from "react";
import { useLocation } from "react-router-dom";

import { List, ListItemText, Collapse } from "@mui/material";
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

  return (
    <li>
      <NavItem
        {...({ component: "button" } as any)}
        selected={hasMatch && !open}
        onClick={() => setOpen((o) => !o)}
      >
        <ListItemText primary={section} style={{ textAlign: "left" }} />

        <ArrowDropDownIcon
          sx={{
            color: "action.active",
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: (theme) => theme.transitions.create("transform"),
          }}
        />
      </NavItem>

      <Collapse in={open}>
        <List disablePadding>
          {tables.map((table) => {
            const route = getTableRoute(table);

            return (
              <li key={table.id}>
                <NavItem
                  to={route}
                  selected={pathname.split("%2F")[0] === route}
                  onClick={closeDrawer}
                  sx={{
                    ml: 2,
                    width: (theme) => `calc(100% - ${theme.spacing(2 + 0.5)})`,
                  }}
                >
                  <ListItemText primary={table.name} />
                </NavItem>
              </li>
            );
          })}
        </List>
      </Collapse>
    </li>
  );
}
