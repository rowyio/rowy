import { useEffect, createElement } from "react";
import { useAtom } from "jotai";
import { isEmpty, get } from "lodash-es";

import { Stack, FormControlLabel, Switch } from "@mui/material";
import FieldWrapper from "./FieldWrapper";

import {
  globalScope,
  userRolesAtom,
  userSettingsAtom,
  sideDrawerShowHiddenFieldsAtom,
} from "@src/atoms/globalScope";
import {
  tableScope,
  tableIdAtom,
  tableSettingsAtom,
  tableColumnsOrderedAtom,
  selectedCellAtom,
} from "@src/atoms/tableScope";
import { formatSubTableName } from "@src/utils/table";
import { getFieldProp } from "@src/components/fields";
import { TableRow } from "@src/types/table";
import { IFieldConfig } from "@src/components/fields/types";

export interface ISideDrawerFieldsProps {
  row: TableRow;
}

export default function SideDrawerFields({ row }: ISideDrawerFieldsProps) {
  const [userRoles] = useAtom(userRolesAtom, globalScope);
  const [userSettings] = useAtom(userSettingsAtom, globalScope);
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  const [selectedCell] = useAtom(selectedCellAtom, tableScope);
  const [showHiddenFields, setShowHiddenFields] = useAtom(
    sideDrawerShowHiddenFieldsAtom,
    globalScope
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
      {fields.map((field, i) => {
        // Derivative/aggregate field support
        let type = field.type;
        if (field.config && field.config.renderFieldType) {
          type = field.config.renderFieldType;
        }

        const fieldComponent: IFieldConfig["SideDrawerField"] = getFieldProp(
          "SideDrawerField",
          type
        );

        // Should not reach this state
        if (isEmpty(fieldComponent)) {
          // console.error('Could not find SideDrawerField component', field);
          return null;
        }

        // Disable field if locked, or if table is read-only
        const disabled = Boolean(
          field.editable === false ||
            (tableSettings.readOnly && !userRoles.includes("ADMIN"))
        );

        return (
          <FieldWrapper
            key={field.key ?? i}
            type={field.type}
            name={field.key}
            label={field.name}
            disabled={disabled}
          >
            {createElement(fieldComponent, {
              column: field as any,
              control: {} as any,
              docRef: row._rowy_ref,
              disabled,
              value: get(row, field.fieldName),
              onSubmit: console.log,
              useFormMethods: {} as any,
            })}
          </FieldWrapper>
        );
      })}

      <FieldWrapper
        type="debug"
        name="_debug_path"
        label="Document path"
        debugText={row._rowy_ref.path ?? row._rowy_ref.id ?? "No ref"}
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
