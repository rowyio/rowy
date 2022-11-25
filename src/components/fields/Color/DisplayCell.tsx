import { IDisplayCellProps } from "@src/components/fields/types";

import { ButtonBase, Box } from "@mui/material";
import { ChevronDown } from "@src/assets/icons";

export default function Color({
  value,
  showPopoverCell,
  disabled,
  tabIndex,
}: IDisplayCellProps) {
  const rendered = (
    <div
      style={{
        flexGrow: 1,
        paddingLeft: "var(--cell-padding)",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {value?.hex && (
        <Box
          sx={{
            width: 18,
            height: 18,
            flexShrink: 0,
            mr: 1,

            backgroundColor: value.hex,
            boxShadow: (theme) => `0 0 0 1px ${theme.palette.divider} inset`,
            borderRadius: 0.5,
          }}
        />
      )}

      {value?.hex}
    </div>
  );

  if (disabled) return rendered;

  return (
    <ButtonBase
      onClick={() => showPopoverCell(true)}
      sx={{
        width: "100%",
        height: "100%",
        font: "inherit",
        color: "inherit",
        letterSpacing: "inherit",
        justifyContent: "flex-start",
      }}
      tabIndex={tabIndex}
    >
      {rendered}
      <ChevronDown className="row-hover-iconButton end" />
    </ButtonBase>
  );
}
