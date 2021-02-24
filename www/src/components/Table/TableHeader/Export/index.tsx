import React, { useState, useMemo, useContext } from "react";

import _camelCase from "lodash/camelCase";
import _get from "lodash/get";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";

import {
  makeStyles,
  createStyles,
  Tooltip,
  Button,
  DialogTitle,
  DialogContent,
  Dialog,
  Tab,
  Tabs,
} from "@material-ui/core";
import ExportIcon from "assets/icons/Export";

import ExportDetails from "./Export";
import DownloadDetails from './Download'
import { SnackContext } from "contexts/SnackContext";
import { useFiretableContext } from "contexts/FiretableContext";
import { db } from "../../../../firebase";
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

export default function Export() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"export" | "download">("export");
  const { tableState } = useFiretableContext();

  const query: any = useMemo(() => {
    let _query = isCollectionGroup()
      ? db.collectionGroup(tableState?.tablePath!)
      : db.collection(tableState?.tablePath!);
    // add filters
    tableState?.filters.forEach((filter) => {
      _query = _query.where(
        filter.key,
        filter.operator as firebase.firestore.WhereFilterOp,
        filter.value
      );
    });
    // optional order results
    if (tableState?.orderBy) {
      tableState?.orderBy?.forEach((orderBy) => {
        _query = _query.orderBy(orderBy.key, orderBy.direction);
      });
    }
    return _query.limit(10000);
  }, [tableState?.tablePath, tableState?.orderBy, tableState?.filters]);

  const handleClose = () => {
    setOpen(false);
    setMode("export");
  };

  return (
    <>
      <Tooltip title="Export/Download">
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          color="secondary"
          aria-label="Export Or Download"
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
        <DialogTitle id="form-dialog-title">{mode}</DialogTitle>
        <DialogContent>
          {(tableState?.filters && tableState?.filters.length !== 0) ||
          (tableState?.orderBy && tableState?.orderBy.length !== 0)
            ? "The filters and sorting applied to the table will be used in the export"
            : "No filters or sorting will be applied on the exported data"}
        </DialogContent>
        <Tabs
          value={mode}
          indicatorColor="primary"
          textColor="primary"
          onChange={(e, v) => setMode(v)}
          variant="fullWidth"
          aria-label="disabled tabs example"
        >
          <Tab label="Export" value={"export"} />
          <Tab label="Download" value={"download"} />
        </Tabs>
        {mode === "export" ? (
          <ExportDetails query={query} closeModal={handleClose} />
        ) : (
            
          <DownloadDetails query={query} closeModal={handleClose} />

        )}
      </Dialog>
    </>
  );
}
