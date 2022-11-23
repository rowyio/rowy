import { IDisplayCellProps } from "@src/components/fields/types";

import { ButtonBase, Grid, Chip } from "@mui/material";
import { ChevronDown } from "@src/assets/icons";

import ChipList from "@src/components/Table/TableCell/ChipList";
import { get } from "lodash-es";
import { getLabel } from "./utils";

export default function Connector({
  value,
  showPopoverCell,
  disabled,
  column,
  tabIndex,
  rowHeight,
}: IDisplayCellProps) {
  const rendered = (
    <ChipList rowHeight={rowHeight}>
      {Array.isArray(value) &&
        value.map((item) => (
          <Grid item key={get(item, column.config?.id)}>
            <Chip label={getLabel(column.config, item)} size="small" />
          </Grid>
        ))}
    </ChipList>
  );

  if (disabled) return rendered;

  return (
    <ButtonBase
      onClick={() => showPopoverCell(true)}
      sx={{
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
