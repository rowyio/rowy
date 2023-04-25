import CircularProgressOptical from "@src/components/CircularProgressOptical";
import {
  IFieldConfig,
  ISideDrawerFieldProps,
} from "@src/components/fields/types";

import { useFormula } from "./useFormula";
import { defaultFn } from "./util";
import { getFieldProp } from "@src/components/fields";
import { createElement } from "react";
import { isEmpty } from "lodash-es";

export default function Formula({
  column,
  onChange,
  onSubmit,
  disabled,
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
        disabled,
        row,
      })}
    </>
  );
}
