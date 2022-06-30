import { colord } from "colord";

export const defaultColors = ["#ED4747", "#F3C900", "#1FAD5F"];

export const resultColorsScale = (
  value: number,
  colors: any = defaultColors,
  defaultColor: string = "#fff"
) =>
  value <= 0.5
    ? colord(colors[0] || defaultColor).mix(
        colors[1] || defaultColor,
        value * 2
      )
    : colord(colors[1] || defaultColor).mix(
        colors[2] || defaultColor,
        (value - 0.5) * 2
      );
