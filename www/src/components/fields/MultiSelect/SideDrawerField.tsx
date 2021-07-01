import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { useTheme, Grid } from "@material-ui/core";
import MultiSelect_ from "@antlerengineering/multiselect";
import FormattedChip from "components/FormattedChip";

import { sanitiseValue } from "./utils";
import { ConvertStringToArray } from "./ConvertStringToArray";

export default function MultiSelect({
  column,
  control,
  disabled,
}: ISideDrawerFieldProps) {
  const theme = useTheme();

  const config = column.config ?? {};

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ onChange, onBlur, value }) => {
        const handleDelete = (index: number) => () => {
          const newValues = [...value];
          newValues.splice(index, 1);
          onChange(newValues);
        };

        if (typeof value === "string" && value !== "")
          return <ConvertStringToArray value={value} onSubmit={onChange} />;

        return (
          <>
            <MultiSelect_
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
              }}
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
