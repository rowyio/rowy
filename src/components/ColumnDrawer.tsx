import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MailIcon from "@material-ui/icons/Mail";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import SimpleTextIcon from "@material-ui/icons/TextFields";
import LongTextIcon from "@material-ui/icons/Notes";
import AddIcon from "@material-ui/icons/Add";
import PhoneIcon from "@material-ui/icons/Phone";

import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import _camelCase from "lodash/camelCase";

const FIELDS = [
  { icon: <SimpleTextIcon />, name: "Simple Text", type: "SIMPLE_TEXT" },
  { icon: <LongTextIcon />, name: "Long Text", type: "LONG_TEXT" },
  { icon: <MailIcon />, name: "Email", type: "EMAIL" },
  { icon: <PhoneIcon />, name: "Phone", type: "PHONE_NUMBER" },
  { icon: <CheckBoxIcon />, name: "Check Box", type: "CHECK_BOX" }
];
const useStyles = makeStyles({
  list: {
    width: 250
  },
  fields: {
    padding: 15
  },

  fullList: {
    width: "auto"
  }
});

export default function ColumnDrawer() {
  const classes = useStyles();
  const [drawerState, toggleDrawer] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [fieldName, setFieldName] = useState("");
  useEffect(() => {
    setFieldName(_camelCase(columnName));
  }, [columnName]);
  const sideList = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={() => {
        toggleDrawer(false);
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
          label="Table Name"
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
          <ListItem button key={field.type}>
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
        {sideList()}
      </Drawer>
    </div>
  );
}
