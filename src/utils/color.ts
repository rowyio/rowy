import { colord, extend } from "colord";
import mixPlugin from "colord/plugins/mix";
extend([mixPlugin]);

export const resultColors = {
  No: "#ED4747",
  Maybe: "#f3c900",
  Yes: "#1fad5f",
};

export const resultColorsScale = (value: number) =>
  value <= 0.5
    ? colord(resultColors.No).mix(resultColors.Maybe, value * 2)
    : colord(resultColors.Maybe).mix(resultColors.Yes, (value - 0.5) * 2);
