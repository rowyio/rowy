import { scale } from "chroma-js";

export const resultColors = {
  No: "#ed4746",
  Maybe: "#f3c900",
  Yes: "#1fad5f",
};

export const resultColorsScale = scale(Object.values(resultColors)).mode("lab");
