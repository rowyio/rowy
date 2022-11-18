import { IHeavyCellProps } from "@src/components/fields/types";

import { Stack } from "@mui/material";

import ActionFab from "./ActionFab";
import { sanitiseCallableName, isUrl } from "./utils";
import { get } from "lodash-es";


export const getActionName = (column: any) => {
  const config = get(column, "config")
  if (!get(config, "customName.enabled")) { return get(column, "name") } 
  return get(config, "customName.actionName") || get(column, "name");
};

export default function Action({
  column,
  row,
  value,
  onSubmit,
  disabled,
}: IHeavyCellProps) {
  const hasRan = value && ![null, undefined].includes(value.status);

  return (
    <Stack
      direction="row"
      alignItems="center"
      className="cell-collapse-padding"
      sx={{ padding: "var(--cell-padding)", pr: 0.5 }}
    >
      <div style={{ flexGrow: 1, overflow: "hidden" }}>
        {hasRan && isUrl(value.status) ? (
          <a href={value.status} target="_blank" rel="noopener noreferrer">
            {value.status}
          </a>
        ) : hasRan ? (
          value.status
        ) : (
          sanitiseCallableName(getActionName(column))
        )}
      </div>

      <ActionFab
        row={row}
        column={column}
        onSubmit={onSubmit}
        value={value}
        disabled={disabled}
      />
    </Stack>
  );
}
