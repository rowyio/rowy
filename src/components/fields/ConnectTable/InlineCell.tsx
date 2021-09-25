import { forwardRef } from "react";
import { IPopoverInlineCellProps } from "../types";

import { ButtonBase, Grid, Chip } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import ChipList from "components/Table/formatters/ChipList";

export const ConnectTable = forwardRef(function ConnectTable(
  { value, showPopoverCell, disabled, column }: IPopoverInlineCellProps,
  ref: React.Ref<any>
) {
  const config = column.config ?? {};

  return (
    <ButtonBase
      onClick={() => showPopoverCell(true)}
      ref={ref}
      disabled={disabled}
      className="cell-collapse-padding"
      sx={{
        height: "100%",
        font: "inherit",
        color: "inherit !important",
        letterSpacing: "inherit",
        textAlign: "inherit",
        justifyContent: "flex-start",
      }}
    >
      <ChipList>
        {Array.isArray(value) &&
          value.map((doc: any) => (
            <Grid item key={doc.docPath}>
              <Chip
                label={config.primaryKeys
                  .map((key: string) => doc.snapshot[key])
                  .join(" ")}
              />
            </Grid>
          ))}
      </ChipList>

      {!disabled && (
        <ArrowDropDownIcon
          className="row-hover-iconButton"
          sx={{
            flexShrink: 0,
            mr: 0.5,
            borderRadius: 1,
            p: (32 - 24) / 2 / 8,
            boxSizing: "content-box",
          }}
        />
      )}
    </ButtonBase>
  );
});

export default ConnectTable;
