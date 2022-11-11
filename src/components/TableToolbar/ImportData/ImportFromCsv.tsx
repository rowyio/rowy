import { useState, useCallback, useRef, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { parse } from "csv-parse/browser/esm";
import { useDropzone } from "react-dropzone";
import { useDebouncedCallback } from "use-debounce";
import { useSnackbar } from "notistack";

import {
  Button,
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

import { Upload as FileUploadIcon } from "@src/assets/icons";
import CheckIcon from "@mui/icons-material/CheckCircle";

import {
  tableModalAtom,
  importCsvAtom,
  tableScope,
} from "@src/atoms/tableScope";
import { analytics, logEvent } from "@src/analytics";

export enum ImportMethod {
  paste = "paste",
  upload = "upload",
  url = "url",
}

export default function ImportFromCsv() {
  const [{ importType: importTypeCsv, csvData }, setImportCsv] = useAtom(
    importCsvAtom,
    tableScope
  );
  const [tab, setTab] = useState("upload");
  const openTableModal = useSetAtom(tableModalAtom, tableScope);
  const importMethodRef = useRef(ImportMethod.upload);
  const importTypeRef = useRef(importTypeCsv);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | any>("");
  const { enqueueSnackbar } = useSnackbar();
  const validCsv =
    csvData !== null && csvData?.columns.length > 0 && csvData?.rows.length > 0;

  useEffect(() => {
    return () => {
      setImportCsv({ importType: "csv", csvData: null });
    };
  }, [setImportCsv]);

  const parseCsv = useCallback(
    (csvString: string) =>
      parse(csvString, { delimiter: [",", "\t"] }, (err, rows) => {
        if (err) {
          setError(err.message);
        } else {
          const columns = rows.shift() ?? [];
          if (columns.length === 0) {
            setError("No columns detected");
          } else {
            const mappedRows = rows.map((row: any) =>
              row.reduce(
                (a: any, c: any, i: number) => ({ ...a, [columns[i]]: c }),
                {}
              )
            );
            setImportCsv({
              importType: importTypeRef.current,
              csvData: { columns, rows: mappedRows },
            });
            setError("");
          }
        }
      }),
    [setImportCsv]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = (event: any) => parseCsv(event.target.result);
        reader.readAsText(file);
        importTypeRef.current =
          file.type === "text/tab-separated-values" ? "tsv" : "csv";
      } catch (error) {
        enqueueSnackbar(`Please import a .tsv or .csv file`, {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
      }
    },
    [enqueueSnackbar, parseCsv]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: ["text/csv", "text/tab-separated-values"],
  });

  function setDataTypeRef(data: string) {
    const getFirstLine = data?.match(/^(.*)/)?.[0];
    /*
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
      ? (importTypeRef.current = "tsv")
      : (importTypeRef.current = "csv");
  }
  const handlePaste = useDebouncedCallback((value: string) => {
    parseCsv(value);
    setDataTypeRef(value);
  }, 1000);

  const handleUrl = useDebouncedCallback((value: string) => {
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

  return (
    <>
      <TabContext value={tab}>
        <TabList
          onChange={(_, v) => {
            setTab(v);
            setImportCsv({
              importType: importTypeRef.current,
              csvData: null,
            });
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

        <TabPanel value="upload">
          <Grid
            container
            justifyContent="center"
            alignContent="center"
            alignItems="center"
            direction="column"
            {...getRootProps()}
            sx={[
              {
                height: 137,
                borderRadius: 1,
                border: `dashed 2px currentColor`,
                borderColor: "divider",
                backgroundColor: "action.input",
                cursor: "pointer",

                "& svg": {
                  opacity: (theme) => theme.palette.action.activeOpacity,
                },

                "&:focus": {
                  borderColor: "primary.main",
                  color: "primary.main",
                  outline: "none",
                },
              },
              error ? { borderColor: "error.main", color: "error.main" } : {},
            ]}
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
            <FormHelperText error sx={{ my: 0.5, mx: 1.5 }}>
              {error}
            </FormHelperText>
          )}
        </TabPanel>

        <TabPanel value="paste">
          <TextField
            variant="filled"
            multiline
            inputProps={{ minRows: 3 }}
            autoFocus
            fullWidth
            label="Paste CSV or TSV text"
            placeholder="column, column, …"
            onChange={(e) => {
              if (csvData !== null)
                setImportCsv({
                  importType: importTypeRef.current,
                  csvData: null,
                });
              handlePaste(e.target.value);
            }}
            sx={{
              typography: "body2",
              fontFamily: "fontFamilyMono",

              "& .MuiInputBase-input": {
                whiteSpace: "nowrap",
                overflow: "auto",
                fontFamily: "mono",
              },
            }}
            helperText={error}
            error={!!error}
          />
        </TabPanel>

        <TabPanel value="url">
          <TextField
            variant="filled"
            autoFocus
            fullWidth
            label="Paste URL to CSV or TSV file"
            placeholder="https://"
            onChange={(e) => {
              if (csvData !== null)
                setImportCsv({
                  importType: importTypeRef.current,
                  csvData: null,
                });
              handleUrl(e.target.value);
            }}
            helperText={loading ? "Fetching…" : error}
            error={!!error}
          />
        </TabPanel>
        <Button
          variant="contained"
          color="primary"
          disabled={!validCsv}
          sx={{
            mb: 2,
            mx: "auto",
            display: "flex",
            minWidth: 100,
          }}
          onClick={() => {
            openTableModal("importCsv");
            logEvent(analytics, `import_${importMethodRef.current}`, {
              type: importTypeRef.current,
            });
          }}
        >
          Continue
        </Button>
      </TabContext>
    </>
  );
}
