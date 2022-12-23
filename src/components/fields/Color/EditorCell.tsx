import { IEditorCellProps } from "@src/components/fields/types";
import { ColorPicker, toColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";

import { Box } from "@mui/material";

export default function Color({ value, onChange }: IEditorCellProps) {
  return (
    <Box sx={{ "& .rcp": { border: 0 } }}>
      <ColorPicker
        width={240}
        height={180}
        color={value?.hex ? toColor("hex", value.hex) : toColor("hex", "#fff")}
        onChange={onChange}
        alpha
      />
    </Box>
  );
}
