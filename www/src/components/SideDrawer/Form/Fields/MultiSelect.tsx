import React from "react";
import { Controller, Control } from "react-hook-form";

import { useTheme, Grid } from "@material-ui/core";

import MultiSelect_, { MultiSelectProps } from "@antlerengineering/multiselect";
import FormattedChip from "components/FormattedChip";

export type IMultiSelectProps = Omit<
  MultiSelectProps<string>,
  "multiple" | "value" | "onChange" | "options"
> & {
  control: Control;
  name: string;

  config?: { options: string[] };
  editable?: boolean;
};

export default function MultiSelect({
  control,
  name,
  editable,
  config,
  ...props
}: IMultiSelectProps) {
  const theme = useTheme();

  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, onBlur, value }) => {
        const handleDelete = (index: number) => () => {
          const newValues = [...value];
          newValues.splice(index, 1);
          onChange(newValues);
        };

        return (
          <>
            <MultiSelect_
              {...props}
              options={config?.options ?? []}
              multiple
              value={value ? value : []}
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

            {value && Array.isArray(value) && (
              <Grid
                container
                spacing={1}
                style={{ marginTop: theme.spacing(1) }}
              >
                {value.map(
                  (item, i) =>
                    item?.length > 0 && (
                      <Grid item key={item}>
                        <FormattedChip
                          size="medium"
                          label={item}
                          onDelete={
                            editable !== false ? handleDelete(i) : undefined
                          }
                        />
                      </Grid>
                    )
                )}
              </Grid>
            )}
          </>
        );
      }}
    />
  );
}
