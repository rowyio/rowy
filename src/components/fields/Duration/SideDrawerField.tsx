import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { Box } from "@mui/material";
import { fieldSx } from "@src/components/SideDrawer/Form/utils";
import { getDurationString } from "./utils";

export default function Duration({ column, control }: ISideDrawerFieldProps) {
  return (
    <Controller
      control={control}
      name={column.key}
      render={({ field: { value } }) => {
        if (
          !value ||
          !value.start ||
          !("toDate" in value.start) ||
          !value.end ||
          !("toDate" in value.end)
        )
          return <Box sx={fieldSx} />;

        return (
          <Box sx={fieldSx}>
            {getDurationString(value.start.toDate(), value.end.toDate())}
          </Box>
        );
      }}
    />
  );
}
