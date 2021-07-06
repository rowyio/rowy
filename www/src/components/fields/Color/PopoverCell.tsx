import { IPopoverCellProps } from "../types";
import { ChromePicker } from "react-color";
import _get from "lodash/get";

export default function Color({ value, onSubmit }: IPopoverCellProps) {
  const handleChangeComplete = (color) => onSubmit(color);

  return (
    <ChromePicker color={value?.rgb} onChangeComplete={handleChangeComplete} />
  );
}
