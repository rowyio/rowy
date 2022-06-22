import { colord } from "colord";

export const defaultColors = {
  startColor: "#ED4747",
  midColor: "#f3c900",
  endColor: "#1fad5f",
};

export const resultColorsScale = (value: number, colors: any = defaultColors) =>
  value <= 0.5
    ? colord(colors.startColor).mix(colors.midColor, value * 2)
    : colord(colors.midColor).mix(colors.endColor, (value - 0.5) * 2);
