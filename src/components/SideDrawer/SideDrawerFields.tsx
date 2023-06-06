import { useEffect, useState, useCallback } from "react";
import { useAtom, useSetAtom } from "jotai";
import { get, isEqual } from "lodash-es";
import { useSnackbar } from "notistack";

import { Stack, FormControlLabel, Switch } from "@mui/material";
import FieldWrapper from "./FieldWrapper";
import MemoizedField from "./MemoizedField";
import SaveState from "./SaveState";

import {
  projectScope,
  userRolesAtom,
  userSettingsAtom,
} from "@src/atoms/projectScope";
import {
  tableScope,
  tableIdAtom,
  tableSettingsAtom,
  tableColumnsOrderedAtom,
  updateFieldAtom,
  selectedCellAtom,
  sideDrawerShowHiddenFieldsAtom,
} from "@src/atoms/tableScope";
import { formatSubTableName } from "@src/utils/table";
import { TableRow } from "@src/types/table";

export interface ISideDrawerFieldsProps {
  row: TableRow;
}

export default function SideDrawerFields({ row }: ISideDrawerFieldsProps) {
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const [userSettings] = useAtom(userSettingsAtom, projectScope);
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  const updateField = useSetAtom(updateFieldAtom, tableScope);
  const [selectedCell] = useAtom(selectedCellAtom, tableScope);
  const [showHiddenFields, setShowHiddenFields] = useAtom(
    sideDrawerShowHiddenFieldsAtom,
    tableScope
  );
  const [saveState, setSaveState] = useState<
    "" | "unsaved" | "saving" | "saved"
  >("");
  const [dirtyField, setDirtyField] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  // Called when a field has unsaved changes
  const onDirty = useCallback((key: string) => {
    setSaveState("unsaved");
    setDirtyField(key);
  }, []);
  // Called when an individual field is ready to be saved
  const onSubmit = useCallback(
    async (fieldName: string, value: any) => {
      if (!selectedCell) return;

      const currentValue = get(row, fieldName);
      if (isEqual(currentValue, value)) {
        setSaveState("");
        setDirtyField("");
        return;
      }

      setSaveState("saving");
      try {
        await updateField({
          path: selectedCell!.path,
          fieldName,
          value,
          deleteField: undefined,
          arrayTableData: {
            index: selectedCell.arrayIndex,
          },
        });

        setSaveState("saved");
      } catch (e) {
        enqueueSnackbar((e as Error).message, { variant: "error" });
        setSaveState("");
      } finally {
        setDirtyField("");
      }
    },
    [row, selectedCell, updateField, enqueueSnackbar]
  );

  const userDocHiddenFields =
    userSettings.tables?.[formatSubTableName(tableId)]?.hiddenFields ?? [];
  const fields = showHiddenFields
    ? tableColumnsOrdered
    : tableColumnsOrdered.filter((f) => !userDocHiddenFields.includes(f.key));

  // Scroll to selected column
  const selectedColumnKey = selectedCell?.columnKey;
  useEffect(() => {
    if (!selectedColumnKey) return;

    const labelElem = document.getElementById(
      `sidedrawer-label-${selectedColumnKey}`
    )?.parentElement;
    const fieldElem = document.getElementById(
      `sidedrawer-field-${selectedColumnKey}`
    );

    // Time out for double-clicking on cells, which can open the null editor
    setTimeout(() => {
      if (labelElem) labelElem.scrollIntoView({ behavior: "smooth" });
      if (fieldElem) fieldElem.focus({ preventScroll: true });
    }, 200);
  }, [selectedColumnKey]);

  return (
    <Stack spacing={3}>
      <SaveState state={saveState} />

      {fields.map((field, i) => (
        <MemoizedField
          key={field.key ?? i}
          field={field}
          disabled={Boolean(
            field.editable === false ||
              (tableSettings.readOnly && !userRoles.includes("ADMIN"))
          )}
          hidden={userDocHiddenFields.includes(field.key)}
          _rowy_ref={row._rowy_ref}
          value={get(row, field.fieldName)}
          onDirty={onDirty}
          onSubmit={onSubmit}
          isDirty={dirtyField === field.key}
          row={row}
        />
      ))}

      <FieldWrapper
        type="debug"
        fieldName="_rowy_ref.path"
        label="Document path"
        debugText={
          row._rowy_ref.arrayTableData
            ? row._rowy_ref.path +
              " → " +
              row._rowy_ref.arrayTableData.parentField +
              "[" +
              row._rowy_ref.arrayTableData.index +
              "]"
            : row._rowy_ref.path
        }
        debugValue={row._rowy_ref.path ?? row._rowy_ref.id ?? "No ref"}
      />

      {userDocHiddenFields.length > 0 && (
        <FormControlLabel
          label={`Show ${userDocHiddenFields.length} hidden field${
            userDocHiddenFields.length === 1 ? "" : "s"
          }`}
          control={
            <Switch
              checked={showHiddenFields}
              onChange={(e) => setShowHiddenFields(e.target.checked)}
            />
          }
          sx={{
            borderTop: 1,
            borderColor: "divider",
            pt: 3,
            "& .MuiSwitch-root": { ml: -0.5 },
          }}
        />
      )}
    </Stack>
  );
}
