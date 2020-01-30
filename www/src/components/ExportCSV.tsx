import React, { useState, useCallback, useContext } from "react";
import _camelCase from "lodash/camelCase";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";

import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";

import ListItemText from "@material-ui/core/ListItemText";

import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import CloudIcon from "@material-ui/icons/CloudDownload";
import { exportTable } from "../firebase/callables";
import { saveAs } from "file-saver";
import useTableConfig from "../hooks/useFiretable/useTableConfig";
import { SnackContext } from "../contexts/snackContext";
import { FireTableFilter } from "../hooks/useFiretable";

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

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    formControl: {
      margin: theme.spacing(1),
      width: 400,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    keyPair: {
      flexGrow: 2,
      display: "flex",
      justifyItems: "space-between",
    },
    cloudIcon: {
      fontSize: 64,
    },
    uploadContainer: {
      margin: "auto",
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
      width: 400,
    },
    chip: {},
  })
);
interface Props {
  columns: any;
  collection: string;
  filters: FireTableFilter[];
}

export default function ExportCSV(props: Props) {
  const { columns, collection, filters } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [csvColumns, setCSVColumns] = useState<any[]>([]);
  const snackContext = useContext(SnackContext);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCSVColumns(event.target.value as any[]);
  };
  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setCSVColumns([]);
  }
  async function handleExport(columns?: any[]) {
    handleClose();
    snackContext.open({
      message: "preparing file, download will start shortly",
      duration: 5000,
    });
    const data = await exportTable({
      collectionPath: collection,
      allFields: !Boolean(columns),
      filters,
      columns: columns ? columns : [],
    });
    var blob = new Blob([data.data], {
      type: "text/csv;charset=utf-8",
    });
    saveAs(blob, `${collection}.csv`);
  }

  return (
    <div>
      <Button
        color="secondary"
        onClick={handleClickOpen}
        endIcon={<CloudIcon />}
      >
        Export CSV
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Export table into CSV</DialogTitle>
        <DialogContent>
          <FormControl className={classes.formControl}>
            <InputLabel id="column-chip-label">Exportable columns</InputLabel>
            <Select
              id="column-chip"
              multiple
              value={csvColumns}
              onChange={handleChange}
              input={<Input id="select-multiple-chip" />}
              renderValue={selected => (
                <div className={classes.chips}>
                  {(selected as any[]).map(value => (
                    <Chip
                      key={value.key}
                      label={value.name}
                      className={classes.chip}
                    />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {columns.map((column: any) => (
                <MenuItem key={column.key} value={column}>
                  {column.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            onClick={() => {
              setCSVColumns(columns);
            }}
          >
            Export All Columns
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleExport();
            }}
            color="secondary"
          >
            Export All Fields
          </Button>
          <Button
            onClick={() => {
              handleExport(csvColumns);
            }}
            disabled={csvColumns.length === 0}
            color="primary"
          >
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
