import { PaletteColor, PaletteOptions, styled } from "@mui/material";

interface StyledDotProps {
  paletteKey?: keyof PaletteOptions | null;
}

export const StyledCell = styled("div")<StyledDotProps>(
  ({ theme, paletteKey }) => {
    let backgroundColor = "var(--cell-background-color)";
    let hoverBackGround = "var(--row-hover-background-color)";
    let textColor = theme.palette.text.primary;
    let hoverTextColor = theme.palette.text.primary;

    if (paletteKey && paletteKey in theme.palette) {
      const themeColor = theme.palette[paletteKey] as PaletteColor;
      // hoverBackGround = themeColor?.main || backgroundColor;
      backgroundColor = themeColor?.main || backgroundColor;
      hoverBackGround =
        (theme.palette.mode === "dark"
          ? themeColor?.dark
          : themeColor?.light) || hoverBackGround;
      // backgroundColor = (theme.palette.mode === "dark" ? themeColor?.dark : themeColor?.light) || hoverBackGround;
      textColor = themeColor.contrastText || textColor;
      hoverTextColor = themeColor.contrastText || hoverTextColor;
    }

    return {
      position: "relative",
      display: "flex",
      alignItems: "center",
      lineHeight: "calc(var(--row-height) - 1px)",
      whiteSpace: "nowrap",
      "--cell-padding": theme.spacing(10 / 8),

      "& > .cell-contents": {
        padding: "0 var(--cell-padding)",
        width: "100%",
        height: "100%",
        contain: "strict",
        overflow: "hidden",

        display: "flex",
        alignItems: "center",
      },

      "& > .cell-contents-contain-none": {
        padding: "0 var(--cell-padding)",
        width: "100%",
        height: "100%",
        contain: "none",
        overflow: "hidden",

        display: "flex",
        alignItems: "center",
      },

      backgroundColor: backgroundColor,
      WebkitTextFillColor: textColor,

      border: `1px solid ${theme.palette.divider}`,
      borderTop: "none",
      "& + &": { borderLeft: "none" },

      "[role='row']:hover &": {
        backgroundColor: hoverBackGround,
        WebkitTextFillColor: hoverTextColor,
      },

      "[data-out-of-order='true'] + [role='row'] &": {
        borderTop: `1px solid ${theme.palette.divider}`,
      },

      "&[aria-invalid='true'] .cell-contents": {
        outline: `2px dotted ${theme.palette.error.main}`,
        outlineOffset: -2,
      },
    };
  }
);
StyledCell.displayName = "StyledCell";

export default StyledCell;
