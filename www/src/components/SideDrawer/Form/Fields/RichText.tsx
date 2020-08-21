import React from "react";
import { Control, Controller } from "react-hook-form";

import _RichText from "components/RichText";

export interface IRichTextProps {
  control: Control;
  name: string;
}

export default function RichText({ control, name }: IRichTextProps) {
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
