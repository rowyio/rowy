import ColorPickerInput from "@src/components/ColorPickerInput";
import { ISettingsProps } from "@src/components/fields/types";

import { useState } from "react";
import { Color, toColor } from "react-color-palette";

export default function Settings({ onChange, config }: ISettingsProps) {
  const defaultColors = {
    startColor: toColor("hex", "#f00"),
    midColor: toColor("hex", "#ff0"),
    endColor: toColor("hex", "#0f0"),
  };

  const {
    startColor,
    midColor,
    endColor,
  }: {
    startColor: Color;
    endColor: Color;
    midColor: Color;
  } = {
    ...defaultColors,
    ...config,
  };

  console.log(startColor, midColor, endColor);

  const [start, setStart] = useState<Color>(startColor);
  const [mid, setMid] = useState<Color>(midColor);
  const [end, setEnd] = useState<Color>(endColor);
  return (
    <>
      {`Config: ${JSON.stringify(config)}`}
      <ColorPickerInput
        value={start}
        handleChange={(color) => setStart(color)}
        handleOnChangeComplete={(color) => onChange("startColor")(color)}
      />
      <ColorPickerInput
        value={mid}
        handleChange={(color) => setMid(color)}
        handleOnChangeComplete={(color) => onChange("midColor")(color)}
      />
      <ColorPickerInput
        value={end}
        handleChange={(color) => setEnd(color)}
        handleOnChangeComplete={(color) => onChange("endColor")(color)}
      />
    </>
  );
}
