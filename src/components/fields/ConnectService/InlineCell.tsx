import { forwardRef } from "react";
import { IPopoverInlineCellProps } from "../types";

import { ButtonBase, Grid, Chip } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import ChipList from "components/Table/formatters/ChipList";
import { get } from "lodash";

export const ConnectService = forwardRef(function ConnectService(
  { value, showPopoverCell, disabled, column }: IPopoverInlineCellProps,
  ref: React.Ref<any>
) {
  const config = column.config ?? {};
  const displayKey = config.titleKey ?? config.primaryKey;
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
        {Array.isArray(value) && (
          <Grid container spacing={0.5} style={{ marginTop: 2 }}>
            {value.map((snapshot) => (
              <Grid item key={get(snapshot, config.primaryKey)}>
                <Chip component="li" label={get(snapshot, displayKey)} />
              </Grid>
            ))}
          </Grid>
        )}
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

export default ConnectService;
