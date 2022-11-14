import { useMemo } from "react";
import { useAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import { find, isEqual } from "lodash-es";
import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { Box, Stack, Link } from "@mui/material";
import ActionFab from "./ActionFab";

import { tableScope, tableRowsAtom } from "@src/atoms/tableScope";
import { fieldSx, getFieldId } from "@src/components/SideDrawer/utils";
import { sanitiseCallableName, isUrl } from "./utils";
import { getActionName } from "./DisplayCell";

export default function Action({
  column,
  _rowy_ref,
  value,
  disabled,
}: ISideDrawerFieldProps) {
  const [row] = useAtom(
    useMemo(
      () =>
        selectAtom(
          tableRowsAtom,
          (tableRows) => find(tableRows, ["_rowy_ref.path", _rowy_ref.path]),
          isEqual
        ),
      [_rowy_ref.path]
    ),
    tableScope
  );

  const hasRan = value && value.status;

  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: -2 / 8 }}>
      <Box
        sx={[
          fieldSx,
          {
            flexGrow: 1,
            whiteSpace: "normal",
            width: "100%",
            overflow: "hidden",
          },
        ]}
      >
        {hasRan && isUrl(value.status) ? (
          <Link
            href={value.status}
            target="_blank"
            rel="noopener noreferrer"
            variant="body2"
            underline="always"
          >
            {value.status}
          </Link>
        ) : hasRan ? (
          value.status
        ) : (
          sanitiseCallableName(getActionName(column))
        )}
      </Box>

      <ActionFab
        row={row}
        column={column}
        value={value}
        disabled={disabled}
        id={getFieldId(column.key)}
      />
    </Stack>
  );
}
