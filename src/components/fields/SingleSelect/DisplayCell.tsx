import { IDisplayCellProps } from "@src/components/fields/types";

import { ButtonBase, Chip } from "@mui/material";
import { ChevronDown } from "@src/assets/icons";
import { useTheme } from "@mui/material";

import { sanitiseValue } from "./utils";
import ChipList from "@src/components/Table/TableCell/ChipList";
import { getColors, IColors } from "./Settings";

export default function SingleSelect({
  value,
  showPopoverCell,
  disabled,
  tabIndex,
  column,
  rowHeight,
}: IDisplayCellProps) {
  const colors: IColors[] = column?.config?.colors ?? [];
  const { mode } = useTheme().palette;

  const rendered = (
    <div
      style={{
        flexGrow: 1,
        overflow: "hidden",
        paddingLeft: "var(--cell-padding)",
      }}
    >
      <ChipList rowHeight={rowHeight}>
        {value && (
          <Chip
            size="small"
            label={sanitiseValue(value)}
            sx={{
              backgroundColor: getColors(colors, value)[mode],
            }}
          />
        )}
      </ChipList>
    </div>
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
