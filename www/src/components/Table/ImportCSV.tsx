import React, { useState, useCallback } from "react";
import _camelCase from "lodash/camelCase";
import { useDropzone } from "react-dropzone";
import parse from "csv-parse";

import {
  makeStyles,
  createStyles,
  Tooltip,
  Typography,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Dialog,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import ImportIcon from "assets/icons/Import";
import ArrowIcon from "@material-ui/icons/TrendingFlatOutlined";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudIcon from "@material-ui/icons/CloudUpload";

import { useFiretableContext } from "contexts/firetableContext";

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
  const { tableState, tableActions } = useFiretableContext();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [csvKeys, setCsvKeys] = useState<string[]>([]);
  const [keyPairs, setKeyPairs] = useState<
    any
    //   { csvKey: string; columnKey: string }[]
  >([]);
  const [csvKey, setCsvKey] = useState();
  const [columnKey, setColumnKey] = useState();
  const [csvData, setCsvData] = useState<any[]>([]);
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    var reader = new FileReader();
    reader.onload = function (event: any) {
      const csvString = event.target.result;
      parse(csvString, {}, function (err, output) {
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
    setCsvKey(undefined);
    setColumnKey(undefined);
  }
  function handleImport() {
    csvData.forEach((row: any[]) => {
      let docData: any = {};
      keyPairs.forEach((pair: { columnKey: string; csvKey: string }) => {
        docData[pair.columnKey] = row[csvKeys.indexOf(pair.csvKey)];
      });
      tableActions?.row.add(docData);
    });
    handleClose();
  }
  return (
    <div>
      <Tooltip title="Import">
        <Button
          onClick={handleClickOpen}
          variant="contained"
          color="secondary"
          aria-label="Import"
          className={classes.button}
        >
          <ImportIcon />
        </Button>
      </Tooltip>

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
                    {Object.values(tableState?.columns as any).map(
                      (column: any) => (
                        <MenuItem value={column.key}>{column.name}</MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
                <IconButton
                  onClick={() => {
                    if (csvKey && columnKey) {
                      setKeyPairs([...keyPairs, { csvKey, columnKey }]);
                      setColumnKey(undefined);
                      setCsvKey(undefined);
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
