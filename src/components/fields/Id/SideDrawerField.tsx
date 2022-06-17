import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { Box } from "@mui/material";
import { fieldSx } from "@src/components/SideDrawer/utils";

export default function Id({ _rowy_ref }: ISideDrawerFieldProps) {
  return (
    <Box sx={[fieldSx, { fontFamily: "fontFamilyMono", userSelect: "all" }]}>
      {_rowy_ref?.id}
    </Box>
  );
}
