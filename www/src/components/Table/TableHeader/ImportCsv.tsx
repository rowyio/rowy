import React, { useState, useCallback } from "react";
import clsx from "clsx";
import parse from "csv-parse";
import { useDropzone } from "react-dropzone";
import { useDebouncedCallback } from "use-debounce";

import {
  makeStyles,
  createStyles,
  Button,
  Popover,
  PopoverProps as MuiPopoverProps,
  Grid,
  Typography,
  TextField,
  FormHelperText,
} from "@material-ui/core";
import { fade } from "@material-ui/core/styles";

import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";

import TableHeaderButton from "./TableHeaderButton";
import ImportIcon from "assets/icons/Import";

import FileUploadIcon from "assets/icons/FileUpload";
import CheckIcon from "@material-ui/icons/CheckCircle";
import GoIcon from "assets/icons/Go";

import ImportCsvWizard, {
  IImportCsvWizardProps,
} from "components/Wizards/ImportCsvWizard";

const useStyles = makeStyles((theme) =>
  createStyles({
    tabPanel: { padding: theme.spacing(4) },
    continueButton: {
      margin: theme.spacing(-2, 2.5, 4),
      display: "flex",
      marginLeft: "auto",
    },

    dropzone: {
      height: 137,
      borderRadius: theme.shape.borderRadius,
      border: `dashed 3px ${fade(theme.palette.text.primary, 0.42)}`,
      backgroundColor: fade(theme.palette.text.primary, 0.09),
      color: theme.palette.text.secondary,
      cursor: "pointer",

      "&:focus": {
        backgroundColor: fade(theme.palette.primary.main, 0.09),
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        outline: "none",
      },
    },
    error: {
      "$dropzone&": {
        backgroundColor: fade(theme.palette.error.main, 0.09),
        borderColor: theme.palette.error.main,
        color: theme.palette.error.main,
      },
    },
    dropzoneError: { margin: theme.spacing(0.5, 1.5) },

    pasteField: {
      ...theme.typography.body2,
      fontFamily: theme.typography.fontFamilyMono,
    },
    pasteInput: {
      whiteSpace: "nowrap",
      overflow: "auto",
    },
  })
);

export interface IImportCsvProps {
  render?: (
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  ) => React.ReactNode;
  PopoverProps?: Partial<MuiPopoverProps>;
}

export default function ImportCsv({ render, PopoverProps }: IImportCsvProps) {
  const classes = useStyles();

  const [open, setOpen] = useState<HTMLButtonElement | null>(null);
  const [tab, setTab] = useState("upload");
  const [csvData, setCsvData] = useState<IImportCsvWizardProps["csvData"]>(
    null
  );
  const [error, setError] = useState("");
  const validCsv =
    csvData !== null && csvData?.columns.length > 0 && csvData?.rows.length > 0;

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) =>
    setOpen(event.currentTarget);
  const handleClose = () => {
    setOpen(null);
    setCsvData(null);
    setTab("upload");
    setError("");
  };
  const popoverId = open ? "csv-popover" : undefined;

  const parseCsv = (csvString: string) =>
    parse(csvString, {}, (err, rows) => {
      if (err) {
        setError(err.message);
      } else {
        const columns = rows.shift() ?? [];
        if (columns.length === 0) {
          setError("No columns detected");
        } else {
          const mappedRows = rows.map((row) =>
            row.reduce((a, c, i) => ({ ...a, [columns[i]]: c }), {})
          );
          setCsvData({ columns, rows: mappedRows });
          setError("");
        }
      }
    });

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (event: any) => parseCsv(event.target.result);
    reader.readAsText(file);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: "text/csv",
  });

  const [handlePaste] = useDebouncedCallback(
    (value: string) => parseCsv(value),
    1000
  );

  const [loading, setLoading] = useState(false);
  const [handleUrl] = useDebouncedCallback((value: string) => {
    setLoading(true);
    setError("");
    fetch(value, { mode: "no-cors" })
      .then((res) => res.text())
      .then((data) => {
        parseCsv(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, 1000);

  const [openWizard, setOpenWizard] = useState(false);

  return (
    <>
      {render ? (
        render(handleOpen)
      ) : (
        <TableHeaderButton
          title="Import CSV"
          onClick={handleOpen}
          icon={<ImportIcon />}
        />
      )}

      <Popover
        id={popoverId}
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        {...PopoverProps}
      >
        <TabContext value={tab}>
          <TabList
            onChange={(_, v) => {
              setTab(v);
              setCsvData(null);
              setError("");
            }}
            aria-label="Import CSV method tabs"
            action={(actions) =>
              setTimeout(() => actions?.updateIndicator(), 200)
            }
          >
            <Tab label="Upload" value="upload" />
            <Tab label="Paste" value="paste" />
            <Tab label="URL" value="url" />
          </TabList>

          <TabPanel value="upload" className={classes.tabPanel}>
            <Grid
              container
              justify="center"
              alignContent="center"
              alignItems="center"
              direction="column"
              {...getRootProps()}
              className={clsx(classes.dropzone, error && classes.error)}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <Typography variant="overline">Drop CSV file here…</Typography>
              ) : (
                <>
                  <Grid item>
                    {validCsv ? (
                      <CheckIcon color="inherit" />
                    ) : (
                      <FileUploadIcon color="inherit" />
                    )}
                  </Grid>
                  <Grid item>
                    <Typography variant="overline" color="inherit">
                      {validCsv
                        ? "Valid CSV"
                        : "Click to upload or drop CSV file here"}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>

            {error && (
              <FormHelperText error className={classes.dropzoneError}>
                {error}
              </FormHelperText>
            )}
          </TabPanel>

          <TabPanel value="paste" className={classes.tabPanel}>
            <TextField
              variant="filled"
              multiline
              inputProps={{ minRows: 5 }}
              autoFocus
              fullWidth
              label="Paste your CSV here"
              onChange={(e) => {
                if (csvData !== null) setCsvData(null);
                handlePaste(e.target.value);
              }}
              InputProps={{
                classes: {
                  root: classes.pasteField,
                  input: classes.pasteInput,
                },
              }}
              helperText={error}
              error={!!error}
            />
          </TabPanel>

          <TabPanel value="url" className={classes.tabPanel}>
            <TextField
              variant="filled"
              autoFocus
              fullWidth
              label="Paste the link to the CSV file here"
              onChange={(e) => {
                if (csvData !== null) setCsvData(null);
                handleUrl(e.target.value);
              }}
              helperText={loading ? "Fetching CSV…" : error}
              error={!!error}
            />
          </TabPanel>
        </TabContext>

        <Button
          endIcon={<GoIcon />}
          disabled={!validCsv}
          className={classes.continueButton}
          onClick={() => setOpenWizard(true)}
        >
          Continue
        </Button>
      </Popover>

      {openWizard && csvData && (
        <ImportCsvWizard
          handleClose={() => setOpenWizard(false)}
          csvData={csvData}
        />
      )}
    </>
  );
}
