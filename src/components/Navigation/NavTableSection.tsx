import { useState } from "react";
import { useLocation } from "react-router-dom";

import { List, ListItemText, Collapse } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NavItem from "./NavItem";

import { Table } from "@src/contexts/ProjectContext";
import { routes } from "@src/constants/routes";

export interface INavDrawerItemProps {
  open?: boolean;
  section: string;
  tables: Table[];
  currentSection?: string;
  closeDrawer?: (e: {}) => void;
}

export default function NavDrawerItem({
  open: openProp,
  section,
  tables,
  currentSection,
  closeDrawer,
}: INavDrawerItemProps) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(openProp || section === currentSection);

  return (
    <li>
      <NavItem
        {...({ component: "button" } as any)}
        selected={!open && currentSection === section}
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
          {tables
            .filter((x) => x)
            .map((table) => {
              const route =
                table.tableType === "collectionGroup"
                  ? `${routes.tableGroup}/${table.id}`
                  : `${routes.table}/${table.id.replace(/\//g, "~2F")}`;

              return (
                <li key={table.id}>
                  <NavItem
                    to={route}
                    selected={pathname.split("%2F")[0] === route}
                    onClick={closeDrawer}
                    sx={{
                      ml: 2,
                      width: (theme) =>
                        `calc(100% - ${theme.spacing(2 + 0.5)})`,
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
