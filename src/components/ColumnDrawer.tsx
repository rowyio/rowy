import React, { useState, useEffect } from "react";
import _camelCase from "lodash/camelCase";

import {
  makeStyles,
  createStyles,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  TextField,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { FIELDS } from "./Fields";

const useStyles = makeStyles(() =>
  createStyles({
    list: {
      width: 250,
    },
    fields: {
      paddingLeft: 15,

      paddingRight: 15,
    },

    fullList: {
      width: "auto",
    },
  })
);

export default function ColumnDrawer(props: any) {
  const { addColumn, columns } = props;
  const classes = useStyles();
  const [drawerState, toggleDrawer] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [fieldName, setFieldName] = useState("");
  useEffect(() => {
    setFieldName(_camelCase(columnName));
  }, [columnName]);
  const drawer = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={() => {
        // toggleDrawer(false);
      }}
    >
      <List className={classes.fields}>
        <TextField
          autoFocus
          onChange={e => {
            setColumnName(e.target.value);
          }}
          margin="dense"
          id="name"
          label="Column Name"
          type="text"
          fullWidth
        />
        <TextField
          value={fieldName}
          onChange={e => {
            setFieldName(e.target.value);
          }}
          margin="dense"
          id="field"
          label="Field Name"
          type="text"
          fullWidth
        />
      </List>
      <Divider />
      <List>
        {FIELDS.map((field: any) => (
          <ListItem
            button
            onClick={() => {
              addColumn(columnName, fieldName, field.type);
            }}
            key={field.type}
          >
            <ListItemIcon>{field.icon}</ListItemIcon>
            <ListItemText primary={field.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <IconButton
        aria-label="add"
        onClick={() => {
          toggleDrawer(true);
        }}
      >
        <AddIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={drawerState}
        onClose={() => {
          toggleDrawer(false);
        }}
      >
        {drawer()}
      </Drawer>
    </div>
  );
}
