import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { useTheme } from "@material-ui/core";
import MultiSelect_ from "@antlerengineering/multiselect";
import FormattedChip from "components/FormattedChip";

import { sanitiseValue } from "./utils";

export default function SingleSelect({
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
      render={({ onChange, onBlur, value }) => (
        <>
          <MultiSelect_
            value={sanitiseValue(value)}
            onChange={onChange}
            options={config.options ?? []}
            multiple={false}
            freeText={config.freeText}
            disabled={disabled}
            TextFieldProps={{
              label: "",
              hiddenLabel: true,
              onBlur,
            }}
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
