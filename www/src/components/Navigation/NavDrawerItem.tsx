import { useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";

import { makeStyles, createStyles } from "@material-ui/styles";
import { List, MenuItem, ListItemText, Collapse } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import { Table } from "contexts/FiretableContext";
import { routes } from "constants/routes";

const useStyles = makeStyles((theme) =>
  createStyles({
    listItem: {
      width: `calc(100% - ${theme.spacing(2)})`,
      margin: theme.spacing(0, 1),
      padding: theme.spacing(0.75, 0.25, 0.75, 1),
    },
    listItemSelected: {
      "&&, &&:hover": { backgroundColor: theme.palette.action.selected },
      "$listItem&:before": {
        top: (36 - 16) / 2,
      },
    },
    listItemIcon: {},
    listItemText: {
      ...theme.typography.body2,
      display: "block",
      color: "inherit",
    },

    dropdownIcon: {
      color: theme.palette.action.active,
      transition: theme.transitions.create("transform"),
    },
    dropdownIconOpen: { transform: "rotate(180deg)" },

    childListItem: {
      minHeight: 36,
      paddingLeft: theme.spacing(4),
    },
    childListItemText: {
      ...theme.typography.body2,
      display: "block",
      color: "inherit",
    },
  })
);

export interface INavDrawerItemProps {
  section: string;
  tables: Table[];

  currentSection?: string;
  currentTable: string;
}

export default function NavDrawerItem({
  section,
  tables,
  currentSection,
  currentTable,
}: INavDrawerItemProps) {
  const classes = useStyles();

  const [open, setOpen] = useState(section === currentSection);

  return (
    <li>
      <MenuItem
        // button
        classes={{
          root: clsx(
            classes.listItem,
            !open && currentSection === section && classes.listItemSelected
          ),
        }}
        selected={!open && currentSection === section}
        onClick={() => setOpen((o) => !o)}
      >
        <ListItemText
          primary={section}
          classes={{ primary: classes.listItemText }}
        />

        <ArrowDropDownIcon
          className={clsx(
            classes.dropdownIcon,
            open && classes.dropdownIconOpen
          )}
        />
      </MenuItem>

      <Collapse in={open}>
        <List disablePadding>
          {tables.map((table) => (
            <li key={table.collection}>
              <MenuItem
                // button
                selected={table.collection === currentTable}
                classes={{
                  root: clsx(classes.listItem, classes.childListItem),
                  selected: classes.listItemSelected,
                }}
                component={Link}
                to={
                  table.isCollectionGroup
                    ? `${routes.tableGroup}/${table.collection}`
                    : `${routes.table}/${table.collection.replace(
                        /\//g,
                        "~2F"
                      )}`
                }
              >
                <ListItemText
                  primary={table.name}
                  classes={{ primary: classes.childListItemText }}
                />
              </MenuItem>
            </li>
          ))}
        </List>
      </Collapse>
    </li>
  );
}
