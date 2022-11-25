import { IDisplayCellProps } from "@src/components/fields/types";

import { ButtonBase, Grid, Chip } from "@mui/material";
import { ChevronDown } from "@src/assets/icons";

import ChipList from "@src/components/Table/TableCell/ChipList";

export default function ConnectTable({
  value,
  showPopoverCell,
  disabled,
  column,
  tabIndex,
  rowHeight,
}: IDisplayCellProps) {
  const config = column.config ?? {};

  const rendered = (
    <ChipList rowHeight={rowHeight}>
      {Array.isArray(value) ? (
        value.map((item: any) => (
          <Grid item key={item.docPath}>
            <Chip
              label={(config.primaryKeys ?? [])
                .map((key: string) => item.snapshot[key])
                .join(" ")}
            />
          </Grid>
        ))
      ) : value ? (
        <Grid item>
          <Chip
            label={(config.primaryKeys ?? [])
              .map((key: string) => value.snapshot[key])
              .join(" ")}
          />
        </Grid>
      ) : null}
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
