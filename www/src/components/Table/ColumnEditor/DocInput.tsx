import React, { useContext, useEffect, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Select from "@material-ui/core/Select";

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
  const [tableConfig, tableConfigActions] = useTableConfig(
    collectionPath ? collectionPath : "initial"
  );

  const [columns, setColumns] = useState<{ key: string; name: string }[]>([]);
  const [primaryKeys, setPrimaryKeys] = useState<string[]>([]);
  const [secondaryKeys, setSecondaryKeys] = useState<string[]>([]);

  useEffect(() => {
    setColumns(tableConfig.columns);
  }, [tableConfig.columns]);

  const classes = useStyles();
  const tables = useContext(TablesContext);
  const onChange = (e: any, v: any) => {
    setValue("collectionPath", v.props.value);
    setPrimaryKeys([]);
    setSecondaryKeys([]);
    setColumns([]);
    tableConfigActions.setTable(v.props.value);
  };
  useEffect(() => {
    setValue("config", {
      primaryKeys,
      secondaryKeys,
    });
  }, [primaryKeys, secondaryKeys]);
  if (tables.value)
    return (
      <>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="select-secondary-multiple-chip">
            Table
          </InputLabel>
          <Select
            value={collectionPath ? collectionPath : null}
            onChange={onChange}
            id={`select-key`}
            inputProps={{
              name: "Table",
              id: "table",
            }}
          >
            {tables.value.map(
              (table: { collection: string; table: string }) => {
                return (
                  <MenuItem
                    id={`select-collection-${table.collection}`}
                    value={table.collection}
                  >
                    <>{table.collection}</>
                  </MenuItem>
                );
              }
            )}
          </Select>
        </FormControl>
        {collectionPath ? (
          <>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="select-primary-multiple-chip">
                Primary Text
              </InputLabel>
              <Select
                multiple
                value={primaryKeys}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  setPrimaryKeys(event.target.value as string[]);
                }}
                input={<Input id="select-primary-multiple-chip" />}
                renderValue={selected => (
                  <div className={classes.chips}>
                    {(selected as string[]).map(value => (
                      <Chip
                        key={value}
                        label={value}
                        className={classes.chip}
                      />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {columns &&
                  columns.length !== 0 &&
                  columns.map(column => (
                    <MenuItem
                      id={`select-primary-column-${column.key}`}
                      key={column.key}
                      value={column.key}
                    >
                      {column.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="select-secondary-multiple-chip">
                Secondary Text
              </InputLabel>
              <Select
                multiple
                value={secondaryKeys}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  setSecondaryKeys(event.target.value as string[]);
                }}
                input={<Input id="select-secondary-multiple-chip" />}
                renderValue={selected => (
                  <div className={classes.chips}>
                    {(selected as string[]).map(value => (
                      <Chip
                        key={value}
                        label={value}
                        className={classes.chip}
                      />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {columns &&
                  columns.length !== 0 &&
                  columns.map(column => (
                    <MenuItem
                      id={`select-secondary-column-${column.key}`}
                      key={column.key}
                      value={column.key}
                    >
                      {column.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </>
        ) : (
          "please select a table"
        )}
      </>
    );
  else return <div />;
}
