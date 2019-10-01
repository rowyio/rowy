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
  Grid,
  IconButton,
} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import AddCSVIcon from "@material-ui/icons/PlaylistAdd";
import ArrowIcon from "@material-ui/icons/TrendingFlatOutlined";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles, createStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { db } from "../firebase";
const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    keyPair: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
  })
);

// TODO: Create an interface for props
export default function ImportCSV(props: any) {
  const { columns, addRow } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [csvKeys, setCsvKeys] = useState<string[]>([]);
  const [keyPairs, setKeyPairs] = useState<
    { csvKey: string; columnKey: string }[]
  >([]);
  const [csvKey, setCsvKey] = useState();
  const [columnKey, setColumnKey] = useState();
  const [csvData, setCsvData] = useState<any[]>([]);
  const onDrop = useCallback(async acceptedFiles => {
    const file = acceptedFiles[0];
    var reader = new FileReader();
    reader.onload = function(event: any) {
      const csvString = event.target.result;
      parse(csvString, {}, function(err, output) {
        const keys = output.shift();
        setCsvData(output);
        setCsvKeys(keys);
      });
    };
    reader.readAsText(file);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });
  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setKeyPairs([]);
    setCsvKeys([]);
    setCsvKey(null);
    setColumnKey(null);
  }
  function handleImport() {
    const newDocs = csvData.map((row: any[]) => {
      let docData: any = {};
      keyPairs.forEach((pair: { columnKey: string; csvKey: string }) => {
        docData[pair.columnKey] = row[csvKeys.indexOf(pair.csvKey)];
      });
      // console.log(docData);
      addRow(docData);
      return docData;
    });
    console.log(newDocs);

    handleClose();
  }

  return (
    <div>
      <Button color="secondary" onClick={handleClickOpen}>
        Import CSV <AddCSVIcon />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Import csv data</DialogTitle>
        <DialogContent>
          <DialogContentText>upload and select</DialogContentText>

          <div {...getRootProps()}>
            <input {...getInputProps()} />

            <p>Drag 'n' drop .csv here, or click to select file</p>
          </div>

          {csvKeys.length !== 0 && (
            <Grid container direction="column">
              {keyPairs.map((keyPair: any, index: number) => (
                <Grid item className={classes.keyPair}>
                  <Typography>{keyPair.csvKey}</Typography>
                  <ArrowIcon />
                  <Typography>{keyPair.columnKey}</Typography>
                  <IconButton
                    onClick={() => {
                      let clonedPairs = [...keyPairs];
                      clonedPairs.splice(index, 1);
                      setKeyPairs(clonedPairs);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              ))}
              <Grid container direction="row" alignContent="center">
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="csv-keys">csv Fields</InputLabel>
                  <Select
                    value={csvKey}
                    onChange={(e: any, v: any) => {
                      setCsvKey(e.target.value);
                    }}
                    inputProps={{
                      name: "csv",
                      id: "csv-keys",
                    }}
                  >
                    {csvKeys.map((key: string) => (
                      <MenuItem value={key}>{key}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <ArrowIcon />
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="column-keys">column Fields</InputLabel>
                  <Select
                    value={columnKey}
                    onChange={(e: any, v: any) => {
                      setColumnKey(e.target.value);
                    }}
                    inputProps={{
                      name: "column",
                      id: "column-keys",
                    }}
                  >
                    {columns.map((column: any) => (
                      <MenuItem value={column.key}>{column.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <IconButton
                  onClick={() => {
                    if (csvKey && columnKey) {
                      setKeyPairs([...keyPairs, { csvKey, columnKey }]);
                      setColumnKey(null);
                      setCsvKey(null);
                    }
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={keyPairs.length === 0}
            color="primary"
          >
            import
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
