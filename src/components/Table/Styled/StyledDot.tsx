import { PaletteColor, PaletteOptions, styled } from "@mui/material";

interface StyledDotProps {
  paletteKey?: keyof PaletteOptions | null;
}

export const StyledDot = styled("div")<StyledDotProps>(
  ({ theme, paletteKey }) => {
    let backgroundColor = theme.palette.error.main; // Default to error palette if customColor is not provided

    if (paletteKey && paletteKey in theme.palette) {
      const themeColor = theme.palette[paletteKey] as PaletteColor;
      backgroundColor =
        (theme.palette.mode === "dark" ? themeColor?.dark : themeColor?.main) ||
        backgroundColor;
    }

    return {
      position: "absolute",
      right: -5,
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 1,
      width: 12,
      height: 12,
      borderRadius: "50%",
      backgroundColor,
      boxShadow: `0 0 0 4px var(--cell-background-color)`,
      "[role='row']:hover &": {
        boxShadow: `0 0 0 4px var(--row-hover-background-color)`,
      },
    };
  }
);

export default StyledDot;
