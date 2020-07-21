import React from "react";
import { Controller, Control } from "react-hook-form";

import { useTheme } from "@material-ui/core";

import MultiSelect, { MultiSelectProps } from "@antlerengineering/multiselect";
import FormattedChip from "components/FormattedChip";

export type ISingleSelectProps = Omit<
  MultiSelectProps<string>,
  "multiple" | "value" | "onChange" | "options"
> & {
  control: Control;
  name: string;

  config?: { options: string[] };
  editable?: boolean;
};

/**
 * Uses the MultiSelect UI, but writes values as a string,
 * not an array of strings
 */
export default function SingleSelect({
  control,
  name,
  editable,
  config,
  ...props
}: ISingleSelectProps) {
  const theme = useTheme();

  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, onBlur, value }) => (
        <>
          <MultiSelect
            {...props}
            options={config?.options ?? []}
            multiple={false}
            value={value}
            onChange={onChange}
            disabled={editable === false}
            TextFieldProps={{
              label: "",
              hiddenLabel: true,
              onBlur,
            }}
            searchable
            freeText={false}
          />

          {value?.length > 0 && (
            <div style={{ marginTop: theme.spacing(1) }}>
              <FormattedChip size="medium" label={value} />
            </div>
          )}
        </>
      )}
    />
  );
}
