import { useEffect, useState } from "react";
import { IPopoverCellProps } from "@src/components/fields/types";
import { useDebouncedCallback } from "use-debounce";
import { ColorPicker, toColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";

import { Box } from "@mui/material";

export default function Color({ value, onSubmit }: IPopoverCellProps) {
  const [localValue, setLocalValue] = useState(value);
  const handleChangeComplete = useDebouncedCallback((color) => {
    onSubmit(color);
  }, 400);

  useEffect(() => {
    handleChangeComplete(localValue);
  }, [localValue]);

  return (
    <Box sx={{ "& .rcp": { border: 0 } }}>
      <ColorPicker
        width={240}
        height={180}
        color={localValue?.hex ? localValue : toColor("hex", "#fff")}
        onChange={setLocalValue}
        alpha
      />
    </Box>
  );
}
