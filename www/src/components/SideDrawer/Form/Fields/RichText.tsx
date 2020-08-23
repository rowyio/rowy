import React from "react";
import { Controller } from "react-hook-form";
import { IFieldProps } from "../utils";

import _RichText from "components/RichText";

export default function RichText({ control, name }: IFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, onBlur, value }) => (
        <_RichText value={value} onChange={onChange} />
      )}
    />
  );
}
