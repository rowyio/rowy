import { useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";

import {
  makeStyles,
  createStyles,
  List,
  ListItem,
  // ListItemIcon,
  ListItemText,
  Collapse,
} from "@material-ui/core";
import { fade } from "@material-ui/core/styles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import { Table } from "contexts/FiretableContext";
import { routes } from "constants/routes";

const useStyles = makeStyles((theme) =>
  createStyles({
    listItem: {
      color: theme.palette.text.secondary,
      minHeight: 48,
    },
    listItemSelected: {
      "&&, &&:hover": {
        color: theme.palette.primary.main,
        backgroundColor: fade(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    listItemIcon: {},
    listItemText: {
      ...theme.typography.button,
      display: "block",
      color: "inherit",
    },

    dropdownIcon: { transition: theme.transitions.create("transform") },
    dropdownIconOpen: { transform: "rotate(180deg)" },

    childListItem: {
      minHeight: 40,
      paddingLeft: theme.spacing(4),
    },
    childListItemText: {
      ...theme.typography.overline,
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
      <ListItem
        button
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
      </ListItem>

      <Collapse in={open}>
        <List>
          {tables.map((table) => (
            <li key={table.collection}>
              <ListItem
                button
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
              </ListItem>
            </li>
          ))}
        </List>
      </Collapse>
    </li>
  );
}
