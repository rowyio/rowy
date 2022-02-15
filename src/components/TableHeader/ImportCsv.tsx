import React, { useState, useCallback, useRef } from "react";
import clsx from "clsx";
import parse from "csv-parse";
import { useDropzone } from "react-dropzone";
import { useDebouncedCallback } from "use-debounce";
import { useSnackbar } from "notistack";

import { makeStyles, createStyles } from "@mui/styles";
import {
  Button,
  Popover,
  PopoverProps as MuiPopoverProps,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  Divider,
} from "@mui/material";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import TableHeaderButton from "./TableHeaderButton";
import ImportIcon from "@src/assets/icons/Import";

import FileUploadIcon from "@src/assets/icons/Upload";
import CheckIcon from "@mui/icons-material/CheckCircle";

import { analytics } from "@src/analytics";
import ImportCsvWizard, {
  IImportCsvWizardProps,
} from "@src/components/Wizards/ImportCsvWizard";
import { useAppContext } from "@src/contexts/AppContext";
import { useProjectContext } from "@src/contexts/ProjectContext";

const useStyles = makeStyles((theme) =>
  createStyles({
    tabPanel: {
      padding: theme.spacing(2, 3),
      width: 400,
      height: 200,
    },
    continueButton: {
      margin: theme.spacing(-4, "auto", 2),
      display: "flex",
      minWidth: 100,
    },
    dropzone: {
      height: 137,
      borderRadius: theme.shape.borderRadius,
      border: `dashed 2px ${theme.palette.divider}`,
      backgroundColor: theme.palette.action.input,
      cursor: "pointer",

      "& svg": { opacity: theme.palette.action.activeOpacity },

      "&:focus": {
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        outline: "none",
      },
    },
    error: {
      "$dropzone&": {
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

export enum ImportType {
  csv = "csv",
  tsv = "tsv",
}

export enum ImportMethod {
  paste = "paste",
  upload = "upload",
  url = "url",
}

export interface IImportCsvProps {
  render?: (
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  ) => React.ReactNode;
  PopoverProps?: Partial<MuiPopoverProps>;
}

export default function ImportCsv({ render, PopoverProps }: IImportCsvProps) {
  const classes = useStyles();
  const { userClaims } = useAppContext();
  const { table } = useProjectContext();
  const { enqueueSnackbar } = useSnackbar();

  const importTypeRef = useRef(ImportType.csv);
  const importMethodRef = useRef(ImportMethod.upload);
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);
  const [tab, setTab] = useState("upload");
  const [csvData, setCsvData] =
    useState<IImportCsvWizardProps["csvData"]>(null);
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
    parse(csvString, { delimiter: [",", "\t"] }, (err, rows) => {
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
    try {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (event: any) => parseCsv(event.target.result);
      reader.readAsText(file);
      importTypeRef.current =
        file.type === "text/tab-separated-values"
          ? ImportType.tsv
          : ImportType.csv;
    } catch (error) {
      enqueueSnackbar(`Please import a .tsv or .csv file`, {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: ["text/csv", "text/tab-separated-values"],
  });

  function setDataTypeRef(data: string) {
    const getFirstLine = data?.match(/^(.*)/)?.[0];
    /**
     *  Catching edge case with regex
     *  EG: "hello\tworld"\tFirst
     *  - find \t between quotes, and replace with '\s'
     *  - w/ the \t pattern test it against the formatted string
     */
    const strInQuotes = /"(.*?)"/;
    const tabsWithSpace = (str: string) => str.replace("\t", "s");
    const formatString =
      getFirstLine?.replace(strInQuotes, tabsWithSpace) ?? "";
    const tabPattern = /\t/;
    return tabPattern.test(formatString)
      ? (importTypeRef.current = ImportType.tsv)
      : (importTypeRef.current = ImportType.csv);
  }
  const [handlePaste] = useDebouncedCallback((value: string) => {
    parseCsv(value);
    setDataTypeRef(value);
  }, 1000);

  const [loading, setLoading] = useState(false);
  const [handleUrl] = useDebouncedCallback((value: string) => {
    setLoading(true);
    setError("");
    fetch(value, { mode: "no-cors" })
      .then((res) => res.text())
      .then((data) => {
        parseCsv(data);
        setDataTypeRef(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, 1000);

  const [openWizard, setOpenWizard] = useState(false);

  if (table?.readOnly && !userClaims?.roles.includes("ADMIN")) return null;

  return (
    <>
      {render ? (
        render(handleOpen)
      ) : (
        <TableHeaderButton
          title="Import CSV or TSV"
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
            variant="fullWidth"
          >
            <Tab
              label="Upload"
              value="upload"
              onClick={() => (importMethodRef.current = ImportMethod.upload)}
            />
            <Tab
              label="Paste"
              value="paste"
              onClick={() => (importMethodRef.current = ImportMethod.paste)}
            />
            <Tab
              label="URL"
              value="url"
              onClick={() => (importMethodRef.current = ImportMethod.url)}
            />
          </TabList>
          <Divider style={{ marginTop: -1 }} />

          <TabPanel value="upload" className={classes.tabPanel}>
            <Grid
              container
              justifyContent="center"
              alignContent="center"
              alignItems="center"
              direction="column"
              {...getRootProps()}
              className={clsx(classes.dropzone, error && classes.error)}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <Typography variant="button" color="primary">
                  Drop CSV or TSV file here…
                </Typography>
              ) : (
                <>
                  <Grid item>
                    {validCsv ? <CheckIcon /> : <FileUploadIcon />}
                  </Grid>
                  <Grid item>
                    <Typography variant="button" color="inherit">
                      {validCsv
                        ? "Valid CSV or TSV"
                        : "Click to upload or drop CSV or TSV file here"}
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
              inputProps={{ minRows: 3 }}
              autoFocus
              fullWidth
              label="Paste CSV or TSV text"
              placeholder="column, column, …"
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
              sx={{ "& .MuiInputBase-input": { fontFamily: "mono" } }}
            />
          </TabPanel>

          <TabPanel value="url" className={classes.tabPanel}>
            <TextField
              variant="filled"
              autoFocus
              fullWidth
              label="Paste URL to CSV or TSV file"
              placeholder="https://"
              onChange={(e) => {
                if (csvData !== null) setCsvData(null);
                handleUrl(e.target.value);
              }}
              helperText={loading ? "Fetching…" : error}
              error={!!error}
            />
          </TabPanel>
        </TabContext>

        <Button
          variant="contained"
          color="primary"
          disabled={!validCsv}
          className={classes.continueButton}
          onClick={() => {
            setOpenWizard(true);
            analytics.logEvent(`import_${importMethodRef.current}`, {
              type: importTypeRef.current,
            });
          }}
        >
          Continue
        </Button>
      </Popover>

      {openWizard && csvData && (
        <ImportCsvWizard
          importType={importTypeRef.current}
          handleClose={() => setOpenWizard(false)}
          csvData={csvData}
        />
      )}
    </>
  );
}
