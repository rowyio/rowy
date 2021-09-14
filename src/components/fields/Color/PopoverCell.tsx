import { IPopoverCellProps } from "../types";
import { ColorPicker, toColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";

export default function Color({ value, onSubmit }: IPopoverCellProps) {
  const handleChangeComplete = (color: any) => onSubmit(color);

  return (
    <ColorPicker
      width={240}
      height={180}
      color={value?.hex ? value : toColor("hex", "#fff")}
      onChange={handleChangeComplete}
      alpha
    />
  );
}
