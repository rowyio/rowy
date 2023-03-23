import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { Grid, Button, Tooltip, useTheme } from "@mui/material";
import WarningIcon from "@mui/icons-material/WarningAmber";
import MultiSelectComponent from "@rowy/multiselect";
import FormattedChip from "@src/components/FormattedChip";

import { fieldSx } from "@src/components/SideDrawer/utils";
import { sanitiseValue } from "./utils";
import { getColors } from "@src/components/fields/SingleSelect/Settings";
import palette, { paletteToMui } from "@src/theme/palette";

export default function MultiSelect({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  const defaultColor = paletteToMui(palette.aGray);
  const config = column.config ?? {};
  const colors = column.config?.colors ?? [];
  const { mode } = useTheme().palette;

  const handleDelete = (index: number) => () => {
    const newValues = [...value];
    newValues.splice(index, 1);
    onChange(newValues);
    onSubmit();
  };

  if (typeof value === "string" && value !== "")
    return (
      <Grid container wrap="nowrap" gap={1}>
        <Grid item xs sx={fieldSx}>
          <Tooltip title="This cell’s value is a string and needs to be converted to an array">
            <WarningIcon color="action" style={{ verticalAlign: "middle" }} />
          </Tooltip>
          &nbsp;{value}
        </Grid>
        <Grid item>
          <Button
            color="primary"
            onClick={() => {
              onChange([value]);
              onSubmit();
            }}
            disabled={disabled}
          >
            Convert to array
          </Button>
        </Grid>
      </Grid>
    );

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
          onBlur: onSubmit,
          id: `sidedrawer-field-${column.key}`,
        }}
        onClose={onSubmit}
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
                    sx={{
                      backgroundColor:
                        getColors(colors, item)[mode] || defaultColor[mode],
                    }}
                  />
                </Grid>
              )
          )}
        </Grid>
      )}
    </>
  );
}
