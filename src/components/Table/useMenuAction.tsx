import { useCallback, useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useSnackbar } from "notistack";
import { find, get, isDate, isFunction } from "lodash-es";

import {
  SelectedCell,
  tableRowsAtom,
  tableSchemaAtom,
  tableScope,
  updateFieldAtom,
} from "@src/atoms/tableScope";
import { getFieldProp, getFieldType } from "@src/components/fields";
import { ColumnConfig } from "@src/types/table";

import { FieldType } from "@src/constants/fields";

import { format, parse, isValid } from "date-fns";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "@src/constants/dates";
import { getDurationString } from "@src/components/fields/Duration/utils";
import { doc } from "firebase/firestore";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import { projectScope } from "@src/atoms/projectScope";

export const SUPPORTED_TYPES_COPY = new Set<FieldType>([
  // TEXT
  FieldType.shortText,
  FieldType.longText,
  FieldType.richText,
  FieldType.email,
  FieldType.phone,
  FieldType.url,
  // SELECT
  FieldType.singleSelect,
  FieldType.multiSelect,
  // NUMERIC
  FieldType.checkbox,
  FieldType.number,
  FieldType.percentage,
  FieldType.rating,
  FieldType.slider,
  FieldType.color,
  FieldType.geoPoint,
  // DATE & TIME
  FieldType.date,
  FieldType.dateTime,
  FieldType.duration,
  // FILE
  FieldType.image,
  FieldType.file,
  // CODE
  FieldType.json,
  FieldType.code,
  FieldType.markdown,
  FieldType.array,
  // CLOUD FUNCTION
  FieldType.action,
  FieldType.derivative,
  FieldType.status,
  // AUDIT
  FieldType.createdBy,
  FieldType.updatedBy,
  FieldType.createdAt,
  FieldType.updatedAt,
  // CONNECTION
  FieldType.arraySubTable,
  FieldType.reference,
  // METADATA
  FieldType.user,
  FieldType.id,
]);

export const SUPPORTED_TYPES_PASTE = new Set<FieldType>([
  // TEXT
  FieldType.shortText,
  FieldType.longText,
  FieldType.richText,
  FieldType.email,
  FieldType.phone,
  FieldType.url,
  // SELECT
  FieldType.singleSelect,
  FieldType.multiSelect,
  // NUMERIC
  FieldType.checkbox,
  FieldType.number,
  FieldType.percentage,
  FieldType.rating,
  FieldType.slider,
  FieldType.color,
  FieldType.geoPoint,
  // DATE & TIME
  FieldType.date,
  FieldType.dateTime,
  FieldType.duration,
  // FILE
  FieldType.image,
  FieldType.file,
  // CODE
  FieldType.json,
  FieldType.code,
  FieldType.markdown,
  FieldType.array,
  // CONNECTION
  FieldType.arraySubTable,
  FieldType.reference,
  // METADATA
  FieldType.user,
]);

export function useMenuAction(
  selectedCell: SelectedCell | null,
  handleClose?: Function
) {
  const { enqueueSnackbar } = useSnackbar();
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const updateField = useSetAtom(updateFieldAtom, tableScope);
  const [cellValue, setCellValue] = useState<any>();
  const [selectedCol, setSelectedCol] = useState<ColumnConfig>();
  const [firebaseDb] = useAtom(firebaseDbAtom, projectScope);

  const handleCopy = useCallback(async () => {
    try {
      if (selectedCol?.type === FieldType.id && selectedCell?.path) {
        await navigator.clipboard.writeText(
          selectedCell?.path.split("/").pop() || ""
        );
        enqueueSnackbar("Copied");
      } else if (
        cellValue !== undefined &&
        cellValue !== null &&
        cellValue !== ""
      ) {
        const value = getValue(cellValue);
        await navigator.clipboard.writeText(value);
        enqueueSnackbar("Copied");
      } else {
        await navigator.clipboard.writeText("");
      }
    } catch (error) {
      enqueueSnackbar(`Failed to copy:${error}`, { variant: "error" });
    }
    if (handleClose) handleClose();
  }, [cellValue, enqueueSnackbar, handleClose]);

  const handleCut = useCallback(async () => {
    try {
      if (!selectedCell || !selectedCol) return;
      if (cellValue !== undefined && cellValue !== null && cellValue !== "") {
        const value = getValue(cellValue);
        await navigator.clipboard.writeText(value);
        enqueueSnackbar("Copied");
      } else {
        await navigator.clipboard.writeText("");
      }
      if (
        cellValue !== undefined &&
        selectedCol.type !== FieldType.createdAt &&
        selectedCol.type !== FieldType.updatedAt &&
        selectedCol.type !== FieldType.createdBy &&
        selectedCol.type !== FieldType.updatedBy &&
        selectedCol.type !== FieldType.checkbox
      )
        updateField({
          path: selectedCell.path,
          fieldName: selectedCol.fieldName,
          value: undefined,
          deleteField: true,
          arrayTableData: {
            index: selectedCell.arrayIndex,
          },
        });
    } catch (error) {
      enqueueSnackbar(`Failed to cut: ${error}`, { variant: "error" });
    }
    if (handleClose) handleClose();
  }, [
    cellValue,
    selectedCell,
    selectedCol,
    updateField,
    enqueueSnackbar,
    handleClose,
  ]);

  const handlePaste = useCallback(
    async (e?: ClipboardEvent) => {
      if (!selectedCell || !selectedCol) return;

      // if the focus element is not gridcell or menuitem (click on paste menu action)
      // it won't paste the copied content inside the gridcell
      if (
        !["gridcell", "menuitem"].includes(document.activeElement?.role ?? "")
      )
        return;

      // prevent from pasting inside array subtable overwrites the whole object
      if (
        document.activeElement
          ?.getAttribute?.("data-row-id")
          ?.startsWith("subtable-array") &&
        selectedCell.columnKey !==
          document.activeElement?.getAttribute?.("data-col-id")
      ) {
        return;
      }

      let clipboardText: string;
      if (navigator.userAgent.includes("Firefox")) {
        // Firefox doesn't allow for reading clipboard data, hence the workaround
        if (!e || !e.clipboardData) {
          enqueueSnackbar(
            `If you're on Firefox, please use the hotkey instead (Ctrl + V / Cmd + V).`,
            {
              variant: "info",
              autoHideDuration: 7000,
            }
          );
          enqueueSnackbar(`Cannot read clipboard data.`, {
            variant: "error",
          });
          return;
        }
        clipboardText = e.clipboardData.getData("text/plain") || "";
      } else {
        try {
          clipboardText = await navigator.clipboard.readText();
        } catch (e) {
          enqueueSnackbar(`Read clipboard permission denied.`, {
            variant: "error",
          });
          return;
        }
      }

      try {
        let parsedValue;
        const cellDataType = getFieldProp(
          "dataType",
          getFieldType(selectedCol)
        );

        // parse value first by type if matches, then by column type
        switch (selectedCol.type) {
          case FieldType.percentage:
            clipboardText = clipboardText.trim();
            if (clipboardText.endsWith("%")) {
              clipboardText = clipboardText.slice(0, -1);
              parsedValue = Number(clipboardText) / 100;
            } else {
              parsedValue = Number(clipboardText);
            }
            if (isNaN(parsedValue))
              throw new Error(`${clipboardText} is not a percentage`);
            break;
          case FieldType.date:
            parsedValue = parse(
              clipboardText,
              selectedCol.config?.format || DATE_FORMAT,
              new Date()
            );
            if (!isValid(parsedValue)) {
              parsedValue = parse(clipboardText, DATE_FORMAT, new Date());
            }
            if (!isValid(parsedValue)) {
              parsedValue = new Date(clipboardText);
            }
            if (!isValid(parsedValue)) {
              throw new Error(`${clipboardText} is not a date`);
            }
            break;
          case FieldType.dateTime:
            parsedValue = parse(
              clipboardText,
              selectedCol.config?.format || DATE_TIME_FORMAT,
              new Date()
            );
            if (!isValid(parsedValue)) {
              parsedValue = parse(clipboardText, DATE_TIME_FORMAT, new Date());
            }
            if (!isValid(parsedValue)) {
              parsedValue = new Date(clipboardText);
            }
            if (!isValid(parsedValue)) {
              throw new Error(`${clipboardText} is not a date`);
            }
            break;
          case FieldType.duration:
            try {
              const json = JSON.parse(clipboardText);
              parsedValue = {
                start: new Date(json.start),
                end: new Date(json.end),
              };
            } catch (e: any) {
              throw new Error(
                `${clipboardText} does not have valida start and end dates`
              );
            }
            break;
          case FieldType.arraySubTable:
            try {
              parsedValue = JSON.parse(clipboardText);
            } catch (e: any) {
              throw new Error(`${clipboardText} is not valid array subtable`);
            }
            if (!Array.isArray(parsedValue)) {
              throw new Error(`${clipboardText} is not an array`);
            }
            break;
          default:
            switch (cellDataType) {
              case "number":
                parsedValue = Number(clipboardText);
                if (isNaN(parsedValue))
                  throw new Error(`${clipboardText} is not a number`);
                break;
              case "string":
                parsedValue = clipboardText;
                break;
              case "reference":
                try {
                  parsedValue = doc(firebaseDb, clipboardText);
                } catch (e: any) {
                  enqueueSnackbar(`Invalid reference.`, { variant: "error" });
                }
                break;
              default:
                parsedValue = JSON.parse(clipboardText);
                break;
            }
        }

        // post process parsed values
        if (selectedCol.type === FieldType.slider) {
          if (parsedValue < selectedCol.config?.min)
            parsedValue = selectedCol.config?.min;
          else if (parsedValue > (selectedCol.config?.max || 10))
            parsedValue = selectedCol.config?.max || 10;
        }
        if (selectedCol.type === FieldType.rating) {
          if (parsedValue < 0) parsedValue = 0;
          if (parsedValue > (selectedCol.config?.max || 5))
            parsedValue = selectedCol.config?.max || 5;
        }

        updateField({
          path: selectedCell.path,
          fieldName: selectedCol.fieldName,
          value: parsedValue,
          arrayTableData: {
            index: selectedCell.arrayIndex,
          },
        });
      } catch (error) {
        enqueueSnackbar(`Paste error on ${selectedCol?.type}: ${error}`, {
          variant: "error",
        });
      }
      if (handleClose) handleClose();
    },
    [selectedCell, selectedCol, updateField, enqueueSnackbar, handleClose]
  );

  useEffect(() => {
    if (!selectedCell) return setCellValue("");
    const selectedCol = tableSchema.columns?.[selectedCell.columnKey];
    if (!selectedCol) return setCellValue("");
    setSelectedCol(selectedCol);

    const selectedRow = find(
      tableRows,
      selectedCell.arrayIndex === undefined
        ? ["_rowy_ref.path", selectedCell.path]
        : // if the table is an array table, we need to use the array index to find the row
          ["_rowy_ref.arrayTableData.index", selectedCell.arrayIndex]
    );
    setCellValue(get(selectedRow, selectedCol.fieldName));
  }, [selectedCell, tableSchema, tableRows]);

  const checkEnabledCopy = useCallback(
    (func: Function) => {
      if (!selectedCol) {
        return function () {
          enqueueSnackbar(`No selected cell`, {
            variant: "error",
          });
        };
      }
      const fieldType = getFieldType(selectedCol);
      return function () {
        if (SUPPORTED_TYPES_COPY.has(fieldType)) {
          return func();
        } else {
          enqueueSnackbar(`${fieldType} cannot be copied`, {
            variant: "error",
          });
        }
      };
    },
    [enqueueSnackbar, selectedCol?.type]
  );

  const checkEnabledPaste = useCallback(
    (func: Function) => {
      if (!selectedCol) {
        return function () {
          enqueueSnackbar(`No selected cell`, {
            variant: "error",
          });
        };
      }
      const fieldType = getFieldType(selectedCol);
      return function (e?: ClipboardEvent) {
        if (SUPPORTED_TYPES_PASTE.has(fieldType)) {
          return func(e);
        } else {
          enqueueSnackbar(`${fieldType} does not support paste`, {
            variant: "error",
          });
        }
      };
    },
    [enqueueSnackbar, selectedCol?.type]
  );

  const getValue = useCallback(
    (cellValue: any) => {
      switch (selectedCol?.type) {
        case FieldType.multiSelect:
        case FieldType.json:
        case FieldType.color:
        case FieldType.geoPoint:
        case FieldType.image:
        case FieldType.file:
        case FieldType.array:
        case FieldType.arraySubTable:
        case FieldType.createdBy:
        case FieldType.updatedBy:
        case FieldType.user:
          return JSON.stringify(cellValue);
        case FieldType.date:
          if (
            (!!cellValue && isFunction(cellValue.toDate)) ||
            isDate(cellValue)
          ) {
            try {
              return format(
                isDate(cellValue) ? cellValue : cellValue.toDate(),
                selectedCol.config?.format || DATE_FORMAT
              );
            } catch (e) {
              return;
            }
          }
          return;
        case FieldType.dateTime:
        case FieldType.createdAt:
        case FieldType.updatedAt:
          if (
            (!!cellValue && isFunction(cellValue.toDate)) ||
            isDate(cellValue)
          ) {
            try {
              return format(
                isDate(cellValue) ? cellValue : cellValue.toDate(),
                selectedCol.config?.format || DATE_TIME_FORMAT
              );
            } catch (e) {
              return;
            }
          }
          return;
        case FieldType.percentage:
          return `${cellValue * 100}%`;
        case FieldType.duration:
          return JSON.stringify({
            duration: getDurationString(
              cellValue.start.toDate(),
              cellValue.end.toDate()
            ),
            start: cellValue.start.toDate(),
            end: cellValue.end.toDate(),
          });
        case FieldType.action:
          return cellValue.status || "";
        case FieldType.reference:
          return cellValue.path;
        case FieldType.formula:
          return cellValue.formula || "";
        default:
          return cellValue;
      }
    },
    [cellValue, selectedCol]
  );

  return {
    handleCopy: checkEnabledCopy(handleCopy),
    handleCut: checkEnabledCopy(handleCut),
    handlePaste: checkEnabledPaste(handlePaste),
    cellValue,
  };
}
