import React, { useState, useCallback } from "react";
import _camelCase from "lodash/camelCase";
import { useDropzone } from "react-dropzone";
import parse from "csv-parse";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";

import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import AddCSVIcon from "@material-ui/icons/PlaylistAdd";
import ArrowIcon from "@material-ui/icons/TrendingFlatOutlined";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import CloudIcon from "@material-ui/icons/CloudUpload";
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
      addRow(docData);
      return docData;
    });
    handleClose();
  }

  return (
    <div>
      <Button
        color="secondary"
        onClick={handleClickOpen}
        endIcon={<AddCSVIcon />}
      >
        Import CSV
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Import a CSV file</DialogTitle>
        <DialogContent>
          {csvKeys.length === 0 ? (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <Grid
                container
                direction="column"
                justify="center"
                alignContent="center"
                alignItems="center"
              >
                <Typography variant="subtitle1">
                  Drag 'n' drop a .csv file here
                </Typography>

                <CloudIcon className={classes.cloudIcon} />
                <Typography variant="subtitle1">or</Typography>
                {isDragActive ? (
                  <p>Drop the file here ...</p>
                ) : (
                  <Button color="secondary">click to select a file</Button>
                )}
              </Grid>
            </div>
          ) : (
            <Grid container direction="column">
              {keyPairs.map((keyPair: any, index: number) => (
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justify="space-between"
                >
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
              <Grid container direction="row" alignItems="center">
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
