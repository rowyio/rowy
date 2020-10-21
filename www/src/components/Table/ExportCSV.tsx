import React, { useState, useContext } from "react";
import { parse as json2csv } from "json2csv";
import { saveAs } from "file-saver";
import _camelCase from "lodash/camelCase";

import {
  makeStyles,
  createStyles,
  Tooltip,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Input,
  Chip,
} from "@material-ui/core";
import ExportIcon from "assets/icons/Export";

import { SnackContext } from "contexts/snackContext";
import { useFiretableContext } from "contexts/firetableContext";
import { db } from "../../firebase";
import { FieldType } from "constants/fields";
import { isCollectionGroup } from "util/fns";
import _get from "lodash/get";

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

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },

    button: {
      padding: 0,
      minWidth: 32,
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
const selectedColumnsReducer = (doc: any) => (
  accumulator: any,
  currentColumn: any
) => {
  const value = _get(doc, currentColumn.key);
  switch (currentColumn.type) {
    case FieldType.multiSelect:
      return {
        ...accumulator,
        [currentColumn.name]: value ? value.join() : "",
      };
    case FieldType.file:
    case FieldType.image:
      return {
        ...accumulator,
        [currentColumn.name]: value
          ? value
              .map((item: { downloadURL: string }) => item.downloadURL)
              .join()
          : "",
      };
    case FieldType.connectTable:
      return {
        ...accumulator,
        [currentColumn.name]:
          value && Array.isArray(value)
            ? value
                .map((item: any) =>
                  currentColumn.config.primaryKeys.reduce(
                    (labelAccumulator: string, currentKey: any) =>
                      `${labelAccumulator} ${item.snapshot[currentKey]}`,
                    ""
                  )
                )
                .join()
            : "",
      };
    case FieldType.checkbox:
      return {
        ...accumulator,
        [currentColumn.name]:
          typeof value === "boolean" ? (value ? "YES" : "NO") : "",
      };
    case FieldType.dateTime:
    case FieldType.date:
      return {
        ...accumulator,
        [currentColumn.name]: value ? value.toDate() : "",
      };
    case FieldType.action:
      return {
        ...accumulator,
        [currentColumn.name]: value && value.status ? value.status : "",
      };
    default:
      return {
        ...accumulator,
        [currentColumn.name]: value ? value : "",
      };
  }
};

export default function ExportCSV() {
  const { tableState } = useFiretableContext();
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
      severity: "info",
      message: "preparing file, download will start shortly",
      duration: 5000,
    });

    let query: any = isCollectionGroup()
      ? db.collectionGroup(tableState?.tablePath!)
      : db.collection(tableState?.tablePath!);
    // add filters
    tableState?.filters.forEach((filter) => {
      query = query.where(filter.key, filter.operator, filter.value);
    });
    // optional order results

    if (tableState?.orderBy) {
      tableState?.orderBy?.forEach((orderBy) => {
        query = query.orderBy(orderBy.key, orderBy.direction);
      });
    }
    query.limit(10000);
    let querySnapshot = await query.get();
    let docs = querySnapshot.docs.map((doc) => doc.data());
    const data = docs.map((doc: any) => {
      return csvColumns.reduce(selectedColumnsReducer(doc), {});
    });
    const csv = json2csv(data);
    var blob = new Blob([csv], {
      type: "text/csv;charset=utf-8",
    });
    saveAs(blob, `${tableState?.tablePath!}.csv`);
  }

  return (
    <div>
      <Tooltip title="Export">
        <Button
          onClick={handleClickOpen}
          variant="contained"
          color="secondary"
          aria-label="Export"
          className={classes.button}
        >
          <ExportIcon />
        </Button>
      </Tooltip>

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
              renderValue={(selected) => (
                <div className={classes.chips}>
                  {(selected as any[]).map((value) => (
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
              {tableState?.columns &&
                (Array.isArray(tableState?.columns)
                  ? tableState?.columns
                  : Object.values(tableState?.columns)
                ).map((column: any) => (
                  <MenuItem key={column.key} value={column}>
                    {column.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Button
            onClick={() => {
              setCSVColumns(Object.values(tableState?.columns!));
            }}
          >
            Select All
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
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
