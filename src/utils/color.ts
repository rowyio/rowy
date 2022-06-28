import { colord } from "colord";

const defaultColors = ["#ED4747", "#F3C900", "#1FAD5F"];

export const resultColorsScale = (value: number, colors: any = defaultColors) =>
  value <= 0.5
    ? colord(colors[0]).mix(colors[1], value * 2)
    : colord(colors[1]).mix(colors[2], (value - 0.5) * 2);
