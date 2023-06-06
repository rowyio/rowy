import { useState, useCallback, useRef, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { parse } from "csv-parse/browser/esm";
import { Parser, ParserOptions } from "@json2csv/plainjs";
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

enum FileType {
  CSV = "text/csv",
  TSV = "text/tab-separated-values",
  JSON = "application/json",
}

// extract the column names and return the names
function extractFields(data: JSON[]): string[] {
  let columns = new Set<string>();
  for (let jsonRow of data) {
    columns = new Set([...columns, ...Object.keys(jsonRow)]);
  }
  columns.delete("id");
  return [...columns];
}

function convertJSONToCSV(rawData: string): string | false {
  let rawDataJSONified: JSON[];
  try {
    rawDataJSONified = JSON.parse(rawData);
  } catch (e) {
    return false;
  }
  if (rawDataJSONified.length < 1) {
    return false;
  }
  const fields = extractFields(rawDataJSONified);
  const opts = {
    fields,
    transforms: [
      (value: any) => {
        // if the value is an array, join it with a comma
        for (let key in value) {
          if (Array.isArray(value[key])) {
            value[key] = value[key].join(",");
          }
        }
        return value;
      },
    ],
  };

  try {
    const parser = new Parser(opts as ParserOptions);
    const csv = parser.parse(rawDataJSONified);
    return csv;
  } catch (err) {
    return false;
  }
}

function hasProperJsonStructure(raw: string) {
  try {
    raw = JSON.parse(raw);
    const type = Object.prototype.toString.call(raw);
    // we don't want '[object Object]'
    return type === "[object Array]";
  } catch (err) {
    return false;
  }
}

function checkIsJson(raw: string): boolean {
  raw = typeof raw !== "string" ? JSON.stringify(raw) : raw;

  try {
    raw = JSON.parse(raw);
  } catch (e) {
    return false;
  }

  if (typeof raw === "object" && raw !== null) {
    return true;
  }
  return false;
}

export default function ImportFromFile() {
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
            // console.log(mappedRows);
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

  const parseFile = useCallback(
    (rawData: string) => {
      if (importTypeRef.current === "json") {
        if (!hasProperJsonStructure(rawData)) {
          return setError("Invalid Structure! It must be an Array");
        }
        const converted = convertJSONToCSV(rawData);
        if (!converted) {
          return setError("No columns detected");
        }
        rawData = converted;
      }
      parseCsv(rawData);
    },
    [parseCsv]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const file = acceptedFiles[0];
        importTypeRef.current =
          file.type === FileType.TSV
            ? "tsv"
            : file.type === FileType.JSON
            ? "json"
            : "csv";
        const reader = new FileReader();
        reader.onload = (event: any) => parseFile(event.target.result);
        reader.readAsText(file);
      } catch (error) {
        enqueueSnackbar(`Please import a .tsv or .csv or .json file`, {
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
    accept: [FileType.CSV, FileType.TSV, FileType.JSON],
  });

  function setDataTypeRef(data: string) {
    if (checkIsJson(data)) {
      return (importTypeRef.current = "json");
    }

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
    setDataTypeRef(value);
    parseFile(value);
  }, 1000);

  const handleUrl = useDebouncedCallback((value: string) => {
    setLoading(true);
    setError("");
    fetch(value, { mode: "no-cors" })
      .then((res) => res.text())
      .then((data) => {
        setDataTypeRef(data);
        parseFile(data);
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
                Drop CSV or TSV or JSON file here…
              </Typography>
            ) : (
              <>
                <Grid item>
                  {validCsv ? <CheckIcon /> : <FileUploadIcon />}
                </Grid>
                <Grid item>
                  <Typography variant="button" color="inherit">
                    {validCsv
                      ? "Valid CSV or TSV or JSON"
                      : "Click to upload or drop CSV or TSV or JSON file here"}
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
            label="Paste CSV or TSV or JSON text"
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
            label="Paste URL to CSV or TSV or JSON file"
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
