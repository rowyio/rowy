import { ISideDrawerFieldProps } from "@src/components/fields/types";
import { IFieldConfig } from "@src/components/fields/types";
import { getFieldProp } from "@src/components/fields";
import { isEmpty } from "lodash-es";
import { createElement } from "react";

export default function Formula({
  column,
  onChange,
  onSubmit,
  _rowy_ref,
  onDirty,
  row,
}: ISideDrawerFieldProps) {
  const value = row[`_rowy_formulaValue_${column.key}`];

  let type = column.type;
  if (column.config && column.config.renderFieldType) {
    type = column.config.renderFieldType;
  }
  const fieldComponent: IFieldConfig["SideDrawerField"] = getFieldProp(
    "SideDrawerField",
    type
  );

  // Should not reach this state
  if (isEmpty(fieldComponent)) {
    console.error("Could not find SideDrawerField component", column);
    return null;
  }

  return (
    <>
      {createElement(fieldComponent, {
        column,
        _rowy_ref,
        value,
        onDirty,
        onChange,
        onSubmit,
        disabled: true,
        row,
      })}
    </>
  );
}
