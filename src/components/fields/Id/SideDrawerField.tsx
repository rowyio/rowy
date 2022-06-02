import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { Box } from "@mui/material";
import { fieldSx } from "@src/components/SideDrawer/Form/utils";

export default function Id({ docRef }: ISideDrawerFieldProps) {
  return (
    <Box sx={[fieldSx, { fontFamily: "fontFamilyMono", userSelect: "all" }]}>
      {docRef?.id}
    </Box>
  );
}
