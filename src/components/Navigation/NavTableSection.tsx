import { useState } from "react";

import { List, ListItemText, Collapse } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import NavItem from "./NavItem";

import { Table } from "contexts/RowyContext";
import { routes } from "constants/routes";

export interface INavDrawerItemProps {
  section: string;
  tables: Table[];
  currentSection?: string;
  closeDrawer: (e: {}) => void;
}

export default function NavDrawerItem({
  section,
  tables,
  currentSection,
  closeDrawer,
}: INavDrawerItemProps) {
  const [open, setOpen] = useState(section === currentSection);

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
          {tables.map((table) => (
            <li key={table.collection}>
              <NavItem
                to={
                  table.isCollectionGroup
                    ? `${routes.tableGroup}/${table.collection}`
                    : `${routes.table}/${table.collection.replace(
                        /\//g,
                        "~2F"
                      )}`
                }
                onClick={closeDrawer}
              >
                <ListItemText primary={table.name} sx={{ pl: 2 }} />
              </NavItem>
            </li>
          ))}
        </List>
      </Collapse>
    </li>
  );
}
