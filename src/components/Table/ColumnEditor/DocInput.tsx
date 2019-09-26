import React, { useContext, useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import { TextField, Grid, Divider, Select } from "@material-ui/core";
import TablesContext from "../../../contexts/tablesContext";
import MenuItem from "@material-ui/core/MenuItem";
import useTableConfig from "../../../hooks/useFiretable/useTableConfig";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";

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
    formControl: {
      margin: Theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
    },
  })
);

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function DocInput(props: any) {
  const { collectionPath, setValue } = props;
  const [tableConfig, tableConfigActions] = useTableConfig(collectionPath);
  useEffect(() => {
    tableConfigActions.setTable(collectionPath);
  }, [collectionPath]);
  const [primaryKeys, setPrimaryKeys] = React.useState<string[]>([]);
  const [secondaryKeys, setSecondaryKeys] = React.useState<string[]>([]);

  const classes = useStyles();
  const tables = useContext(TablesContext);
  const onChange = (e: any, v: any) => {
    setValue("collectionPath", v.props.value);
  };

  if (tables.value)
    return (
      <>
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
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="select-multiple-chip">Primary Text</InputLabel>
          <Select
            multiple
            value={primaryKeys}
            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
              setPrimaryKeys(event.target.value as string[]);
            }}
            input={<Input id="select-multiple-chip" />}
            renderValue={selected => (
              <div className={classes.chips}>
                {(selected as string[]).map(value => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {names.map(name => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="select-multiple-chip">Primary Text</InputLabel>
          <Select
            multiple
            value={secondaryKeys}
            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
              setSecondaryKeys(event.target.value as string[]);
            }}
            input={<Input id="select-multiple-chip" />}
            renderValue={selected => (
              <div className={classes.chips}>
                {(selected as string[]).map(value => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {names.map(name => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    );
  else return <div />;
}
