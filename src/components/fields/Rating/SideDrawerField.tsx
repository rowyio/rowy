import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { Grid } from "@mui/material";
import { Rating as MuiRating } from "@mui/material";
import { fieldSx } from "@src/components/SideDrawer/utils";
import Icon from "./Icon";

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
          onChange(newValue);
          onSubmit();
        }}
        icon={<Icon config={column.config} isEmpty={false} />}
        emptyIcon={<Icon config={column.config} isEmpty={true} />}
        size="small"
        max={max}
        precision={precision}
        sx={{ ml: -0.5 }}
        // id={getFieldId(column.key)}
      />
    </Grid>
  );
}
