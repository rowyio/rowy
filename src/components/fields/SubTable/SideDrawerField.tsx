import { useWatch } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";
import { Link } from "react-router-dom";

import { Stack, IconButton } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

import { useFieldStyles } from "@src/components/SideDrawer/Form/utils";
import { useSubTableData } from "./utils";

export default function SubTable({
  column,
  control,
  docRef,
}: ISideDrawerFieldProps) {
  const fieldClasses = useFieldStyles();

  const row = useWatch({ control });
  const { documentCount, label, subTablePath } = useSubTableData(
    column,
    row,
    docRef
  );

  return (
    <Stack direction="row">
      <div className={fieldClasses.root}>
        {documentCount} {column.name as string}: {label}
      </div>

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
