import { IPopoverCellProps } from "../types";
import { ColorPicker, toColor } from "react-color-palette";
import { useDebouncedCallback } from "use-debounce";
import "react-color-palette/lib/css/styles.css";
import { useEffect, useState } from "react";

export default function Color({ value, onSubmit }: IPopoverCellProps) {
  const [localValue, setLocalValue] = useState(value);
  const [handleChangeComplete] = useDebouncedCallback((color) => {
    onSubmit(color);
  }, 400);
  useEffect(() => {
    handleChangeComplete(localValue);
  }, [localValue]);
  return (
    <ColorPicker
      width={240}
      height={180}
      color={localValue?.hex ? localValue : toColor("hex", "#fff")}
      onChange={setLocalValue}
      alpha
    />
  );
}
