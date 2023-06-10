import { useState } from "react";
import { useAtom } from "jotai";
import { Parser } from "@json2csv/plainjs";
import { saveAs } from "file-saver";
import { useSnackbar } from "notistack";
import { getDocs } from "firebase/firestore";
import { get, find } from "lodash-es";

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
import ColumnSelect from "@src/components/Table/ColumnSelect";

import {
  tableScope,
  tableIdAtom,
  tableColumnsOrderedAtom,
} from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";
import { analytics, logEvent } from "@src/analytics";
import { TableRow, ColumnConfig } from "@src/types/table";
import { IExportModalContentsProps } from ".";

const selectedColumnsJsonReducer =
  (doc: TableRow) =>
  (accumulator: Record<string, any>, currentColumn: ColumnConfig) => {
    const value = get(doc, currentColumn.key);

    if (
      currentColumn.type === FieldType.file ||
      currentColumn.type === FieldType.image
    ) {
      return {
        ...accumulator,
        [currentColumn.key]: value
          ? value
              .map((item: { downloadURL: string }) => item.downloadURL)
              .join()
          : "",
      };
    }

    if (currentColumn.type === FieldType.reference) {
      return {
        ...accumulator,
        [currentColumn.key]: value ? value.path : "",
      };
    }
    return {
      ...accumulator,
      [currentColumn.key]: value,
    };
  };

const selectedColumnsCsvReducer =
  (doc: TableRow) =>
  (accumulator: Record<string, string>, currentColumn: ColumnConfig) => {
    const value = get(doc, currentColumn.key);
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
                    currentColumn.config?.primaryKeys?.reduce(
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

export default function Export({
  query,
  closeModal,
}: IExportModalContentsProps) {
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
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
        .map((key) => find(tableColumnsOrdered, ["key", key]))
        .filter((x) => !!x)
    );

  const handleExport = async () => {
    handleClose();
    logEvent(analytics, "export_table", { type: exportType });
    enqueueSnackbar("Preparing file. Download will start shortly.");
    let querySnapshot = await getDocs(query);
    let docs = querySnapshot.docs.map((doc) => ({
      id: doc.ref.id,
      ...doc.data(),
    }));

    const fileName = `${tableId}-${new Date().toISOString()}.${exportType}`;
    switch (exportType) {
      case "csv":
      case "tsv":
        const csvData = docs.map((doc: any) =>
          columns.reduce(selectedColumnsCsvReducer(doc), {})
        );
        const parser = new Parser(
          exportType === "tsv" ? { delimiter: "\t" } : undefined
        );
        const csv = parser.parse(csvData);
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
      <ColumnSelect
        value={columns.map((x) => x.key)}
        onChange={handleChange}
        label="Columns to export"
        labelPlural="columns"
        TextFieldProps={{
          autoFocus: true,
          helperText: "Files and images will be added as URLs",
        }}
        multiple
        selectAll
      />

      <div>
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
      </div>

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
