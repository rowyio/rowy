import React from "react";
import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";
import _CodeEditor from "components/Code";


export default function CodeEditor({
  control,
  column,
  disabled,
}: ISideDrawerFieldProps) {

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ onChange, value }) =>  <_CodeEditor disabled={disabled} value={value} onChange={onChange} />}
    />
  );
}
