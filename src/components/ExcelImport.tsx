import React, { useState, useCallback } from "react";
import _camelCase from "lodash/camelCase";
import { useDropzone } from "react-dropzone";
import parse from "csv-parse";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

// TODO: Create an interface for props
export default function ImportExcel(props: any) {
  const { classes, columnName, updateColumn } = props;
  const [open, setOpen] = React.useState(false);
  const onDrop = useCallback(async acceptedFiles => {
    console.log(acceptedFiles);

    const file = acceptedFiles[0];
    var reader = new FileReader();
    reader.onload = function(event: any) {
      const csvString = event.target.result;

      parse(csvString, {}, function(err, output) {
        const keys = output[0];
        console.log(output);
      });
    };
    reader.readAsText(file);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    //   accept: ["image/png", "image/jpg", "image/jpeg"],
  });
  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }
  function handleUpdate() {
    // updateColumn(tableName, collectionName);
    handleClose();
  }

  return (
    <div>
      <Button onClick={handleClickOpen}>import excel</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">New table</DialogTitle>
        <DialogContent>
          <DialogContentText>Create a new Table</DialogContentText>

          <div {...getRootProps()}>
            <input {...getInputProps()} />

            <p>Drag 'n' drop .xlsx here, or click to select file</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
