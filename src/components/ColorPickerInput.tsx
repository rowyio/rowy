import { useState, useRef, MutableRefObject, useLayoutEffect } from "react";
import { Box, useTheme } from "@mui/material";

import { Color, ColorPicker } from "react-color-palette";

const useResponsiveWidth = (): [
  width: number,
  setRef: MutableRefObject<HTMLElement | null>
] => {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!ref || !ref.current) {
      return;
    }
    const resizeObserver = new ResizeObserver((targets) => {
      const { width: currentWidth } = targets[0].contentRect;
      setWidth(currentWidth);
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return [width, ref];
};

export interface IColorPickerProps {
  value: Color;
  onChangeComplete: (color: Color) => void;
  disabled?: boolean;
}

export default function ColorPickerInput({
  value,
  onChangeComplete,
  disabled = false,
}: IColorPickerProps) {
  const [localValue, setLocalValue] = useState(value);
  const [width, setRef] = useResponsiveWidth();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark" ? true : false;

  return (
    <Box
      ref={setRef}
      sx={[
        {
          padding: theme.spacing(1.5),
          paddingTop: theme.spacing(1),
          transitionDuration: 0,
          "& .rcp": {
            border: "none",
            "& .rcp-saturation": {
              borderRadius: theme.spacing(0.5),
            },
            "& .rcp-body": {
              boxSizing: "unset",
            },
          },
          ".rcp-dark": {
            "--rcp-background": "transparent",
          },
        },
      ]}
    >
      <ColorPicker
        width={width}
        height={150}
        color={localValue}
        onChange={(color) => setLocalValue(color)}
        onChangeComplete={onChangeComplete}
        dark={isDark}
      />
    </Box>
  );
}
