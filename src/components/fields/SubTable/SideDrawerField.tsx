import { useWatch } from "react-hook-form";
import { ISideDrawerFieldProps } from "@src/components/fields/types";
import { Link } from "react-router-dom";

import { Box, Stack, IconButton } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

import { fieldSx } from "@src/components/SideDrawer/utils";
import { useSubTableData } from "./utils";

export default function SubTable({
  column,
  control,
  docRef,
}: ISideDrawerFieldProps) {
  const row = useWatch({ control });
  const { documentCount, label, subTablePath } = useSubTableData(
    column as any,
    row as any,
    docRef
  );

  return (
    <Stack direction="row">
      <Box sx={fieldSx}>
        {documentCount} {column.name as string}: {label}
      </Box>

      <IconButton
        component={Link}
        to={subTablePath}
        edge="end"
        size="small"
        sx={{ ml: 1 }}
        disabled={!subTablePath}
      >
        <LaunchIcon />
      </IconButton>
    </Stack>
  );
}
