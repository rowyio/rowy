import { useCallback, useState, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useSnackbar } from "notistack";
import { get, find } from "lodash-es";

import {
  tableScope,
  tableSchemaAtom,
  tableRowsAtom,
  updateFieldAtom,
  SelectedCell,
} from "@src/atoms/tableScope";
import { getFieldProp, getFieldType } from "@src/components/fields";
import { ColumnConfig } from "@src/types/table";

import { FieldType } from "@src/constants/fields";

import { format } from "date-fns";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "@src/constants/dates";
import { isDate, isFunction } from "lodash-es";
import { getDurationString } from "@src/components/fields/Duration/utils";
import { doc } from "firebase/firestore";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import { projectScope } from "@src/atoms/projectScope";

export const SUPPORTED_TYPES_COPY = new Set([
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
  // AUDIT
  FieldType.createdBy,
  FieldType.updatedBy,
  FieldType.createdAt,
  FieldType.updatedAt,
  // CONNECTION
  FieldType.reference,
  FieldType.id,
]);

export const SUPPORTED_TYPES_PASTE = new Set([
  // TEXT
  FieldType.shortText,
  FieldType.longText,
  FieldType.richText,
  FieldType.email,
  FieldType.phone,
  FieldType.url,
  // NUMERIC
  FieldType.number,
  FieldType.percentage,
  FieldType.rating,
  FieldType.slider,
  // CODE
  FieldType.json,
  FieldType.code,
  FieldType.markdown,
  // CONNECTION
  FieldType.reference,
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
      try {
        if (!selectedCell || !selectedCol) return;

        // checks which element has focus, if it is not the gridcell it won't paste the copied content inside the gridcell
        if (document.activeElement?.role !== "gridcell") return;

        let text: string;
        // Firefox doesn't allow for reading clipboard data, hence the workaround
        if (navigator.userAgent.includes("Firefox")) {
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
          text = e.clipboardData.getData("text/plain") || "";
        } else {
          try {
            text = await navigator.clipboard.readText();
          } catch (e) {
            enqueueSnackbar(`Read clipboard permission denied.`, {
              variant: "error",
            });
            return;
          }
        }
        const cellDataType = getFieldProp(
          "dataType",
          getFieldType(selectedCol)
        );
        let parsed;
        switch (cellDataType) {
          case "number":
            parsed = Number(text);
            if (isNaN(parsed)) throw new Error(`${text} is not a number`);
            break;
          case "string":
            parsed = text;
            break;
          case "reference":
            try {
              parsed = doc(firebaseDb, text);
            } catch (e: any) {
              enqueueSnackbar(`Invalid reference.`, { variant: "error" });
            }
            break;
          default:
            parsed = JSON.parse(text);
            break;
        }

        if (selectedCol.type === FieldType.slider) {
          if (parsed < selectedCol.config?.min)
            parsed = selectedCol.config?.min;
          else if (parsed > selectedCol.config?.max)
            parsed = selectedCol.config?.max;
        }

        if (selectedCol.type === FieldType.rating) {
          if (parsed < 0) parsed = 0;
          if (parsed > (selectedCol.config?.max || 5))
            parsed = selectedCol.config?.max || 5;
        }

        if (selectedCol.type === FieldType.percentage) {
          parsed = parsed / 100;
        }
        updateField({
          path: selectedCell.path,
          fieldName: selectedCol.fieldName,
          value: parsed,
          arrayTableData: {
            index: selectedCell.arrayIndex,
          },
        });
      } catch (error) {
        enqueueSnackbar(
          `${selectedCol?.type} field does not support the data type being pasted`,
          { variant: "error" }
        );
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
          enqueueSnackbar(`${fieldType} field cannot be copied`, {
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
          enqueueSnackbar(
            `${fieldType} field does not support paste functionality`,
            {
              variant: "error",
            }
          );
        }
      };
    },
    [enqueueSnackbar, selectedCol?.type]
  );

  const getValue = useCallback(
    (cellValue: any) => {
      switch (selectedCol?.type) {
        case FieldType.percentage:
          return cellValue * 100;
        case FieldType.json:
        case FieldType.color:
        case FieldType.geoPoint:
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
        case FieldType.duration:
          return getDurationString(
            cellValue.start.toDate(),
            cellValue.end.toDate()
          );
        case FieldType.image:
        case FieldType.file:
          return cellValue[0].downloadURL;
        case FieldType.createdBy:
        case FieldType.updatedBy:
          return cellValue.displayName;
        case FieldType.reference:
          return cellValue.path;
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
