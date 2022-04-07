import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import CodeEditor from "@src/components/CodeEditor";

export default function Code({
  control,
  column,
  disabled,
}: ISideDrawerFieldProps) {
  return (
    <Controller
      control={control}
      name={column.key}
      render={({ field: { onChange, value } }) => (
        <CodeEditor
          defaultLanguage={column.config?.language}
          disabled={disabled}
          value={value}
          onChange={onChange}
        />
      )}
    />
  );
}
