import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { Grid } from "@mui/material";
import { Rating as MuiRating } from "@mui/material";
import "@mui/lab";
import { getStateIcon, getStateOutline } from "./TableCell";
import { fieldSx } from "@src/components/SideDrawer/utils";

export default function Rating({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  // Set max and precision from config
  const { max, precision } = { max: 5, precision: 1, ...column.config };

  return (
    <Grid container alignItems="center" sx={fieldSx}>
      <MuiRating
        name={column.key}
        id={`sidedrawer-field-${column.key}`}
        value={typeof value === "number" ? value : 0}
        disabled={disabled}
        onChange={(_, newValue) => {
          console.log("onChange", newValue);
          onChange(newValue);
          onSubmit();
        }}
        icon={getStateIcon(column.config)}
        emptyIcon={getStateOutline(column.config)}
        size="small"
        max={max}
        precision={precision}
        sx={{ ml: -0.5 }}
        // id={getFieldId(column.key)}
      />
    </Grid>
  );
}
