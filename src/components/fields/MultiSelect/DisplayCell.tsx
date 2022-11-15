import { IDisplayCellProps } from "@src/components/fields/types";

import { ButtonBase, Grid, Tooltip } from "@mui/material";
import WarningIcon from "@mui/icons-material/WarningAmber";
import { ChevronDown } from "@src/assets/icons";

import { sanitiseValue } from "./utils";
import ChipList from "@src/components/Table/ChipList";
import FormattedChip from "@src/components/FormattedChip";

export default function MultiSelect({
  value,
  showPopoverCell,
  disabled,
  tabIndex,
  rowHeight,
}: IDisplayCellProps) {
  const rendered =
    typeof value === "string" && value !== "" ? (
      <div style={{ flexGrow: 1, paddingLeft: "var(--cell-padding)" }}>
        <Tooltip title="This cell’s value is a string and needs to be converted to an array">
          <WarningIcon color="action" style={{ verticalAlign: "middle" }} />
        </Tooltip>
        &nbsp;
        {value}
      </div>
    ) : (
      <ChipList rowHeight={rowHeight}>
        {sanitiseValue(value).map(
          (item) =>
            typeof item === "string" && (
              <Grid item key={item}>
                <FormattedChip label={item} />
              </Grid>
            )
        )}
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
