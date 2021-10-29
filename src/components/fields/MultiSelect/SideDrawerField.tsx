import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { Grid } from "@mui/material";
import MultiSelectComponent from "@rowy/multiselect";
import FormattedChip from "@src/components/FormattedChip";

import { sanitiseValue } from "./utils";
import { ConvertStringToArray } from "./ConvertStringToArray";

export default function MultiSelect({
  column,
  control,
  disabled,
}: ISideDrawerFieldProps) {
  const config = column.config ?? {};

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ field: { onChange, onBlur, value } }) => {
        const handleDelete = (index: number) => () => {
          const newValues = [...value];
          newValues.splice(index, 1);
          onChange(newValues);
        };

        if (typeof value === "string" && value !== "")
          return <ConvertStringToArray value={value} onSubmit={onChange} />;

        return (
          <>
            <MultiSelectComponent
              value={sanitiseValue(value)}
              onChange={onChange}
              options={config.options ?? []}
              multiple={true}
              freeText={config.freeText}
              disabled={disabled}
              TextFieldProps={{
                label: "",
                hiddenLabel: true,
                onBlur,
                id: `sidedrawer-field-${column.key}`,
              }}
            />

            {value && Array.isArray(value) && (
              <Grid container spacing={0.5} style={{ marginTop: 2 }}>
                {value.map(
                  (item, i) =>
                    item?.length > 0 && (
                      <Grid item key={item}>
                        <FormattedChip
                          label={item}
                          onDelete={disabled ? undefined : handleDelete(i)}
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
