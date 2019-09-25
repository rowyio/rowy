import React, { useContext } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import { TextField, Grid, Divider, Select } from "@material-ui/core";
import TablesContext from "../../../contexts/tablesContext";
import MenuItem from "@material-ui/core/MenuItem";
const useStyles = makeStyles(Theme =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      maxWidth: 300,
      padding: Theme.spacing(1),
    },
    chip: {
      margin: Theme.spacing(0.5),
    },
  })
);

export default function DocInput(props: any) {
  const { collectionPath, setValue } = props;

  const classes = useStyles();
  const tables = useContext(TablesContext);
  const onChange = (e: any, v: any) => {
    setValue("collectionPath", v.props.value);
  };
  console.log(collectionPath);
  if (tables.value)
    return (
      <Select
        value={collectionPath ? collectionPath : null}
        onChange={onChange}
        inputProps={{
          name: "Table",
          id: "table",
        }}
      >
        {tables.value.map((table: { collection: string; table: string }) => {
          return (
            <MenuItem
              id={`select-collection-${table.collection}`}
              value={table.collection}
            >
              <>{table.collection}</>
            </MenuItem>
          );
        })}
      </Select>
    );
  else return <div />;
}
