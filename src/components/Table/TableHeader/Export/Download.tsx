import { useState, useRef } from "react";
import { saveAs } from "file-saver";
import { useSnackbar } from "notistack";

import _get from "lodash/get";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";
import { isString } from "lodash";
import MultiSelect from "@rowy/multiselect";
import JSZip from "jszip";

import {
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import { useProjectContext } from "@src/contexts/ProjectContext";
import SnackbarProgress, {
  ISnackbarProgressRef,
} from "@src/components/SnackbarProgress";

import { FieldType } from "@src/constants/fields";
import { hasDataTypes } from "@src/components/fields";

const DOWNLOADABLE_COLUMNS = [FieldType.image, FieldType.file];
const LABEL_COLUMNS = hasDataTypes(["string", "number"]);

const download = (url) => fetch(url).then((resp) => resp.blob());

const selectedColumnsFilesReducer =
  (doc: any, labelColumns: any[]) => (accumulator: any, currentColumn: any) => {
    const files = _get(doc, currentColumn.key);
    if (!files || files.length === 0) return accumulator;
    return [
      ...accumulator,
      ...files.map((file, index) => ({
        ...file,
        fieldKey: currentColumn.key,
        name:
          labelColumns.length === 0
            ? file.name
            : `${currentColumn.key}/${labelColumns
                .map((labelColumn) => {
                  const value = _get(doc, labelColumn.key);
                  return value && typeof value === "string"
                    ? value.replace(/[^a-zA-Z ]/g, "")
                    : "";
                })
                .join("_")}${files.length === 1 ? "" : `_${index}`}.${file.name
                .split(".")
                .pop()}`,
      })),
    ];
  };

export default function Export({ query, closeModal }) {
  const { tableState } = useProjectContext();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const snackbarProgressRef = useRef<ISnackbarProgressRef>();

  const [columns, setColumns] = useState<any[]>([]);
  const [labelColumnsEnabled, setLabelColumnsEnabled] = useState(false);
  const [labelColumns, setLabelColumns] = useState<any[]>([]);
  const [packageName, setPackageName] = useState(tableState?.config.id);

  const handleClose = () => {
    closeModal();
    setColumns([]);
  };

  const handleChange = (setState) => (keys: string[]) =>
    setState(
      keys
        .map((key) => _find(tableState!.columns, ["key", key]))
        .filter((x) => !!x)
    );

  const handleDownload = async () => {
    handleClose();

    const preparingSnackbar = enqueueSnackbar(
      "Preparing file. Download will start shortly.",
      { persist: true }
    );

    let querySnapshot = await query.get();
    let docs = querySnapshot.docs.map((doc) => doc.data());
    const files = docs
      .map((doc: any) =>
        columns.reduce(selectedColumnsFilesReducer(doc, labelColumns), [])
      )
      .reduce((acc, row) => [...acc, ...row], []);
    var zip = new JSZip();
    let completedCount = 0;

    closeSnackbar(preparingSnackbar);
    const downloadingSnackbar = enqueueSnackbar("Downloading", {
      action: (
        <SnackbarProgress
          stateRef={snackbarProgressRef}
          target={files.length}
        />
      ),
      persist: true,
    });

    const downloads = files.map((file) =>
      download(file.downloadURL).then((blob: any) => {
        zip.file(file.name, blob, { base64: true });
        completedCount++;
        snackbarProgressRef.current?.setProgress(completedCount);
      })
    );

    await Promise.all(downloads);
    zip
      .generateAsync({ type: "blob" })
      .then((content) => saveAs(content, `${packageName}.zip`));

    closeSnackbar(downloadingSnackbar);
    enqueueSnackbar("Download complete", { variant: "success" });
  };
  return (
    <>
      <MultiSelect
        value={columns.map((x) => x.key)}
        onChange={handleChange(setColumns)}
        options={(typeof tableState!.columns === "object" &&
        !Array.isArray(tableState!.columns)
          ? _sortBy(Object.values(tableState!.columns), ["index"]).filter(
              (column: any) =>
                isString(column?.name) &&
                isString(column?.key) &&
                DOWNLOADABLE_COLUMNS.includes(column.type)
            )
          : []
        ).map((column: any) => ({ label: column.name, value: column.key }))}
        label="Columns to export"
        labelPlural="columns"
        TextFieldProps={{
          helperText: "Only File and Image columns are downloadable",
        }}
        multiple
        selectAll
      />

      <TextField
        fullWidth
        label="Package name"
        value={packageName}
        helperText={`${packageName}.zip`}
        onChange={(e) => setPackageName(e.target.value)}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={labelColumnsEnabled}
            onChange={(e) => setLabelColumnsEnabled(e.target.checked)}
            name="labelColumnsEnabled"
          />
        }
        label="Replace file names with table values"
      />

      <MultiSelect
        disabled={!labelColumnsEnabled}
        value={labelColumns.map((x) => x.key)}
        onChange={handleChange(setLabelColumns)}
        options={(typeof tableState!.columns === "object" &&
        !Array.isArray(tableState!.columns)
          ? _sortBy(Object.values(tableState!.columns), ["index"]).filter(
              (column: any) =>
                isString(column?.name) &&
                isString(column?.key) &&
                LABEL_COLUMNS.includes(column.type)
            )
          : []
        ).map((column: any) => ({ label: column.name, value: column.key }))}
        label="Column values to include in file names"
        labelPlural="columns"
        TextFieldProps={{
          autoFocus: true,
          helperText:
            labelColumns.length === 0
              ? `Use original file name`
              : `eg. column/${labelColumns.map((c) => c.key).join("_")}.jpeg`,
        }}
        multiple
        selectAll
      />

      <div style={{ flexGrow: 1, marginTop: 0 }} />

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>

        <Button
          onClick={handleDownload}
          disabled={columns.length === 0}
          color="primary"
          variant="contained"
        >
          Download
        </Button>
      </DialogActions>
    </>
  );
}
