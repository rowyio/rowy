import { forwardRef } from "react";
import { Grid, GridProps, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";
import { spreadSx } from "@src/utils/ui";

export const COLUMN_HEADER_HEIGHT = 42;

export interface IColumnProps extends Partial<GridProps> {
  label: string;
  type?: FieldType;
  secondaryItem?: React.ReactNode;
  children?: React.ReactNode;

  active?: boolean;
}

export const Column = forwardRef(function Column(
  {
    label,
    type,
    secondaryItem,
    children,

    active,
    ...props
  }: IColumnProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <Grid
      ref={ref}
      container
      alignItems="center"
      wrap="nowrap"
      aria-label={label}
      {...props}
      sx={[
        {
          width: "100%",
          height: COLUMN_HEADER_HEIGHT,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          backgroundColor: "background.default",
          position: "relative",

          py: 0,
          px: 1,

          color: "text.secondary",
          "&:hover": { color: "text.primary" },

          "& svg": { display: "block" },
        },
        active
          ? {
              backgroundColor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.selectedOpacity
                ),
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.text.primary
                  : theme.palette.primary.dark,
              borderColor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.disabledOpacity
                ),

              "&:hover": {
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.text.primary
                    : theme.palette.primary.dark,
              },
            }
          : {},
        ...spreadSx(props.sx),
      ]}
    >
      {type && <Grid item>{getFieldProp("icon", type)}</Grid>}

      <Grid
        item
        xs
        style={{
          flexShrink: 1,
          overflow: "hidden",
        }}
      >
        <Typography
          component={Grid}
          item
          variant="caption"
          noWrap
          sx={{
            fontWeight: "fontWeightMedium",
            lineHeight: "42px",
            display: "block",

            userSelect: "none",

            ml: 0.5,
          }}
        >
          {label}
        </Typography>
      </Grid>

      {secondaryItem && (
        <Grid item sx={{ ml: 1, position: "relative" }}>
          {secondaryItem}
        </Grid>
      )}

      {children}
    </Grid>
  );
});

export default Column;
