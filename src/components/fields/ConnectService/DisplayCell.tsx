import { IDisplayCellProps } from "@src/components/fields/types";

import { ButtonBase, Grid, Chip } from "@mui/material";
import { ChevronDown } from "@src/assets/icons";

import ChipList from "@src/components/Table/TableCell/ChipList";
import { get } from "lodash-es";

export default function ConnectService({
  value,
  showPopoverCell,
  disabled,
  column,
  tabIndex,
  rowHeight,
}: IDisplayCellProps) {
  const config = column.config ?? {};
  const displayKey = config.titleKey ?? config.primaryKey;

  const rendered = (
    <ChipList rowHeight={rowHeight}>
      {Array.isArray(value) &&
        value.map((snapshot) => (
          <Grid item key={get(snapshot, config.primaryKey)}>
            <Chip label={get(snapshot, displayKey)} size="small" />
          </Grid>
        ))}
    </ChipList>
  );

  if (disabled) return rendered;

  return (
    <ButtonBase
      onClick={() => showPopoverCell(true)}
      style={{
        width: "100%",
        height: "100%",
        font: "inherit",
        color: "inherit !important",
        letterSpacing: "inherit",
        textAlign: "inherit",
        justifyContent: "flex-start",
      }}
      tabIndex={tabIndex}
    >
      {rendered}
      <ChevronDown className="row-hover-iconButton end" />
    </ButtonBase>
  );
}
