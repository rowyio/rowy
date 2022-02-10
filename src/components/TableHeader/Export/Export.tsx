import { useState } from "react";
import { parse as json2csv } from "json2csv";
import { saveAs } from "file-saver";
import { useSnackbar } from "notistack";

import _get from "lodash/get";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";
import { isString } from "lodash";
import MultiSelect from "@rowy/multiselect";

import {
  Button,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";
import { analytics } from "@src/analytics";

const selectedColumnsJsonReducer =
  (doc: any) => (accumulator: any, currentColumn: any) => {
    const value = _get(doc, currentColumn.key);
    return {
      ...accumulator,
      [currentColumn.key]: value,
    };
  };

const selectedColumnsCsvReducer =
  (doc: any) => (accumulator: any, currentColumn: any) => {
    const value = _get(doc, currentColumn.key);
    const formatter = getFieldProp("csvExportFormatter", currentColumn.type);
    if (formatter) {
      return {
        ...accumulator,
        [currentColumn.name]: value
          ? formatter(value, currentColumn.config)
          : "",
      };
    }
    // TODO: move to field csvExportFormatter
    switch (currentColumn.type) {
      case FieldType.multiSelect:
        return {
          ...accumulator,
          [currentColumn.name]: value ? value.join() : "",
        };
      case FieldType.file:
      case FieldType.image:
        return {
          ...accumulator,
          [currentColumn.name]: value
            ? value
                .map((item: { downloadURL: string }) => item.downloadURL)
                .join()
            : "",
        };
      case FieldType.connectTable:
        return {
          ...accumulator,
          [currentColumn.name]:
            value && Array.isArray(value)
              ? value
                  .map((item: any) =>
                    currentColumn.config.primaryKeys.reduce(
                      (labelAccumulator: string, currentKey: any) =>
                        `${labelAccumulator} ${item.snapshot[currentKey]}`,
                      ""
                    )
                  )
                  .join()
              : "",
        };
      case FieldType.checkbox:
        return {
          ...accumulator,
          [currentColumn.name]:
            typeof value === "boolean" ? (value ? "YES" : "NO") : "",
        };
      case FieldType.dateTime:
      case FieldType.date:
        return {
          ...accumulator,
          [currentColumn.name]: value && value["toDate"] ? value.toDate() : "",
        };
      case FieldType.action:
        return {
          ...accumulator,
          [currentColumn.name]: value && value.status ? value.status : "",
        };
      default:
        return {
          ...accumulator,
          [currentColumn.name]: value ? value : "",
        };
    }
  };

export default function Export({ query, closeModal }) {
  const { tableState } = useProjectContext();
  const { enqueueSnackbar } = useSnackbar();

  const [columns, setColumns] = useState<any[]>([]);
  const [exportType, setExportType] = useState<"csv" | "tsv" | "json">("csv");

  const handleClose = () => {
    closeModal();
    setColumns([]);
  };

  const handleChange = (keys: string[]) =>
    setColumns(
      keys
        .map((key) => _find(tableState!.columns, ["key", key]))
        .filter((x) => !!x)
    );

  const handleExport = async () => {
    handleClose();
    analytics.logEvent("export_table", {
      type: exportType,
    });
    enqueueSnackbar("Preparing file. Download will start shortly.");
    let querySnapshot = await query.get();
    let docs = querySnapshot.docs.map((doc) => ({
      id: doc.ref.id,
      ...doc.data(),
    }));

    const fileName = `${tableState?.config
      .id!}-${new Date().toISOString()}.${exportType}`;
    switch (exportType) {
      case "csv":
      case "tsv":
        const csvData = docs.map((doc: any) =>
          columns.reduce(selectedColumnsCsvReducer(doc), {})
        );
        const csv = json2csv(
          csvData,
          exportType === "tsv" ? { delimiter: "\t" } : undefined
        );
        const csvBlob = new Blob([csv], {
          type: `text/${exportType};charset=utf-8`,
        });
        saveAs(csvBlob, fileName);
        break;
      case "json":
        const jsonData = docs.map((doc: any) =>
          columns.reduce(selectedColumnsJsonReducer(doc), { id: doc.id })
        );
        const jsonBlob = new Blob([JSON.stringify(jsonData)], {
          type: `text/${exportType};charset=utf-8`,
        });
        saveAs(jsonBlob, fileName);
        break;
      default:
        break;
    }
  };
  return (
    <>
      <MultiSelect
        value={columns.map((x) => x.key)}
        onChange={handleChange}
        options={(typeof tableState!.columns === "object" &&
        !Array.isArray(tableState!.columns)
          ? _sortBy(Object.values(tableState!.columns), ["index"]).filter(
              (column: any) => isString(column?.name) && isString(column?.key)
            )
          : []
        ).map((column: any) => ({ label: column.name, value: column.key }))}
        label="Columns to export"
        labelPlural="columns"
        TextFieldProps={{
          autoFocus: true,
          helperText: "Files and images will be added as URLs",
        }}
        multiple
        selectAll
      />

      <FormControl component="fieldset">
        <FormLabel component="legend">Export type</FormLabel>
        <RadioGroup
          aria-label="export type"
          name="export-type-radio-buttons-group"
          value={exportType}
          onChange={(e) => {
            const v = e.target.value;
            if (v) setExportType(v as "csv" | "tsv" | "json");
          }}
        >
          <FormControlLabel value="csv" control={<Radio />} label=".csv" />
          <FormControlLabel value="tsv" control={<Radio />} label=".tsv" />
          <FormControlLabel value="json" control={<Radio />} label=".json" />
        </RadioGroup>
        <FormHelperText>Encoding: UTF-8</FormHelperText>
      </FormControl>

      <div style={{ flexGrow: 1, marginTop: 0 }} />

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>

        <Button
          onClick={handleExport}
          disabled={columns.length === 0}
          color="primary"
          variant="contained"
        >
          Export
        </Button>
      </DialogActions>
    </>
  );
}
