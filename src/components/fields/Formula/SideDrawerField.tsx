import { ISideDrawerFieldProps } from "@src/components/fields/types";
import { defaultFn } from "@src/components/fields/Formula/util";
import { useFormula } from "@src/components/fields/Formula/useFormula";
import { IFieldConfig } from "@src/components/fields/types";
import { getFieldProp } from "@src/components/fields";
import { isEmpty } from "lodash-es";
import { createElement } from "react";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

export default function Formula({
  column,
  onChange,
  onSubmit,
  _rowy_ref,
  onDirty,
  row,
}: ISideDrawerFieldProps) {
  const { result, error, loading } = useFormula({
    row: row,
    ref: _rowy_ref,
    listenerFields: column.config?.listenerFields || [],
    formulaFn: column.config?.formulaFn || defaultFn,
  });

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

  if (error) {
    return <>Error: {error.message}</>;
  }

  if (loading) {
    return <CircularProgressOptical id="progress" size={20} sx={{ m: 0.25 }} />;
  }

  return (
    <>
      {createElement(fieldComponent, {
        column,
        _rowy_ref,
        value: result,
        onDirty,
        onChange,
        onSubmit,
        disabled: true,
        row,
      })}
    </>
  );
}
