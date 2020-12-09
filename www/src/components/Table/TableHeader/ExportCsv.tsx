import React, { useState, useContext } from "react";
import { parse as json2csv } from "json2csv";
import { saveAs } from "file-saver";
import _camelCase from "lodash/camelCase";
import _get from "lodash/get";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";
import MultiSelect from "@antlerengineering/multiselect";

import {
  makeStyles,
  createStyles,
  Tooltip,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Dialog,
} from "@material-ui/core";
import ExportIcon from "assets/icons/Export";

import { SnackContext } from "contexts/SnackContext";
import { useFiretableContext } from "contexts/FiretableContext";
import { db } from "../../../firebase";
import { FieldType } from "constants/fields";
import { isCollectionGroup } from "utils/fns";

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      padding: 0,
      minWidth: 32,
    },
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

export default function ExportCsv() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const { tableState } = useFiretableContext();
  const snackContext = useContext(SnackContext);

  const [csvColumns, setCsvColumns] = useState<any[]>([]);

  const handleClose = () => {
    setOpen(false);
    setCsvColumns([]);
  };

  const handleChange = (keys: string[]) =>
    setCsvColumns(
      keys
        .map((key) => _find(tableState!.columns, ["key", key]))
        .filter((x) => !!x)
    );

  const handleExport = async () => {
    handleClose();
    snackContext.open({
      severity: "info",
      message: "Preparing file. Download will start shortly",
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

    const data = docs.map((doc: any) =>
      csvColumns.reduce(selectedColumnsReducer(doc), {})
    );
    const csv = json2csv(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `${tableState?.tablePath!}-${new Date().toISOString()}.csv`);
  };

  return (
    <>
      <Tooltip title="Export CSV">
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          color="secondary"
          aria-label="Export"
          className={classes.button}
        >
          <ExportIcon />
        </Button>
      </Tooltip>

      <Dialog
        open={open && !!tableState}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        aria-describedby="form-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">Export Table to CSV</DialogTitle>

        <DialogContent>
          <DialogContentText id="form-dialog-description">
            Export the current table view, including filters and sorting order,
            to a CSV file.
          </DialogContentText>
          <DialogContentText>
            Choose which columns to export to get started.
          </DialogContentText>

          <MultiSelect
            value={csvColumns.map((x) => x.key)}
            onChange={handleChange}
            options={(typeof tableState!.columns === "object" &&
            !Array.isArray(tableState!.columns)
              ? _sortBy(Object.values(tableState!.columns), ["index"])
              : []
            ).map((column: any) => ({ label: column.name, value: column.key }))}
            label="Columns to Export"
            labelPlural="columns"
            TextFieldProps={{ autoFocus: true }}
            multiple
            selectAll
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>

          <Button
            onClick={handleExport}
            disabled={csvColumns.length === 0}
            color="primary"
            variant="contained"
          >
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
