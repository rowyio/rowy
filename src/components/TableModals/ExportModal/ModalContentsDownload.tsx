import { useState, useRef } from "react";
import { useAtom } from "jotai";
import { useSnackbar } from "notistack";
import { get, find, isString } from "lodash-es";
import { saveAs } from "file-saver";
import { getDocs } from "firebase/firestore";
import JSZip from "jszip";

import MultiSelect from "@rowy/multiselect";

import {
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ColumnSelect from "@src/components/Table/ColumnSelect";

import {
  tableScope,
  tableIdAtom,
  tableColumnsOrderedAtom,
} from "@src/atoms/tableScope";
import SnackbarProgress, {
  ISnackbarProgressRef,
} from "@src/components/SnackbarProgress";
import { IExportModalContentsProps } from ".";
import { hasDataTypes } from "@src/components/fields";
import { FieldType } from "@src/constants/fields";
import { FileValue } from "@src/types/table";

const DOWNLOADABLE_COLUMNS = [FieldType.image, FieldType.file];
const LABEL_COLUMNS = hasDataTypes(["string", "number"]);

const download = (url: string) => fetch(url).then((resp) => resp.blob());

const selectedColumnsFilesReducer =
  (doc: any, labelColumns: any[]) => (accumulator: any, currentColumn: any) => {
    const files: FileValue[] | undefined = get(doc, currentColumn.key);
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
                  const value = get(doc, labelColumn.key);
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

export default function Export({
  query,
  closeModal,
}: IExportModalContentsProps) {
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const snackbarProgressRef = useRef<ISnackbarProgressRef>();

  const [columns, setColumns] = useState<any[]>([]);
  const [labelColumnsEnabled, setLabelColumnsEnabled] = useState(false);
  const [labelColumns, setLabelColumns] = useState<any[]>([]);
  const [packageName, setPackageName] = useState(tableId);

  const handleClose = () => {
    closeModal();
    setColumns([]);
  };

  const handleChange = (setState: (v: any) => void) => (keys: string[]) =>
    setState(
      keys
        .map((key) => find(tableColumnsOrdered, ["key", key]))
        .filter((x) => !!x)
    );

  const handleDownload = async () => {
    handleClose();

    const preparingSnackbar = enqueueSnackbar(
      "Preparing file. Download will start shortly.",
      { persist: true }
    );

    let querySnapshot = await getDocs(query);
    let docs = querySnapshot.docs.map((doc) => doc.data());
    const files: FileValue[] = docs
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
      <ColumnSelect
        value={columns.map((x) => x.key)}
        onChange={handleChange(setColumns)}
        filterColumns={(column) =>
          column.type === FieldType.derivative
            ? DOWNLOADABLE_COLUMNS.includes(column.config?.renderFieldType)
            : DOWNLOADABLE_COLUMNS.includes(column.type)
        }
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
        options={tableColumnsOrdered
          .filter(
            (column) =>
              isString(column.name) &&
              isString(column.key) &&
              LABEL_COLUMNS.includes(column.type)
          )
          .map((column: any) => ({ label: column.name, value: column.key }))}
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
