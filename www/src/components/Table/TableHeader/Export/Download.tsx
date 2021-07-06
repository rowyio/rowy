import { useState, useContext } from "react";
import { saveAs } from "file-saver";
import _camelCase from "lodash/camelCase";
import _get from "lodash/get";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";
import { isString } from "lodash";
import MultiSelect from "@antlerengineering/multiselect";
import JSZip from "jszip";

import {
  Grid,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

import { SnackContext } from "contexts/SnackContext";
import { useFiretableContext } from "contexts/FiretableContext";

import { FieldType } from "constants/fields";
import { hasDataTypes } from "components/fields";

const DOWNLOADABLE_COLUMNS = [FieldType.image, FieldType.file];
const LABEL_COLUMNS = hasDataTypes(["string", "number"]);

const download = (url) => fetch(url).then((resp) => resp.blob());

const selectedColumnsFilesReducer = (doc: any, labelColumns: any[]) => (
  accumulator: any,
  currentColumn: any
) => {
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
              .join("_")}${
              files.length === 1 ? "" : `_${index}`
            }.${file.name.split(".").pop()}`,
    })),
  ];
};

export default function Export({ query, closeModal }) {
  const { tableState } = useFiretableContext();
  const snackContext = useContext(SnackContext);

  const [columns, setColumns] = useState<any[]>([]);
  const [labelColumnsEnabled, setLabelColumnsEnabled] = useState(false);
  const [labelColumns, setLabelColumns] = useState<any[]>([]);
  const [packageName, setPackageName] = useState(tableState?.tablePath);

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
    snackContext.open({
      variant: "progress",
      message: "Preparing file. Download will start shortly",
    });
    let querySnapshot = await query.get();
    let docs = querySnapshot.docs.map((doc) => doc.data());
    const files = docs
      .map((doc: any) =>
        columns.reduce(selectedColumnsFilesReducer(doc, labelColumns), [])
      )
      .reduce((acc, row) => [...acc, ...row], []);
    var zip = new JSZip();
    let completedCount = 0;
    const downloads = files.map((file) =>
      download(file.downloadURL).then((blob: any) => {
        zip.file(file.name, blob, { base64: true });
        completedCount++;
        snackContext.open({
          variant: "progress",
          message: "Downloading",
        });
        snackContext.setProgress({
          value: completedCount,
          target: files.length,
        });
      })
    );

    await Promise.all(downloads);
    zip
      .generateAsync({ type: "blob" })
      .then((content) => saveAs(content, `${packageName}.zip`));
    snackContext.open({
      variant: "success",
      message: "Download completed successfully",
      duration: 2000,
    });
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
        label="Columns to Export"
        labelPlural="columns"
        TextFieldProps={{
          helperText: "only Files and images columns are downloadable",
        }}
        multiple
        selectAll
      />

      <TextField
        fullWidth
        label="Package Name"
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
        label="Column Values to Include in File Names"
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

      <Grid
        container
        spacing={2}
        justify="center"
        alignItems="center"
        style={{ flexShrink: 0 }}
      >
        <Grid item>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </Grid>

        <Grid>
          <Button
            onClick={handleDownload}
            disabled={columns.length === 0}
            color="primary"
            variant="contained"
          >
            Download
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
