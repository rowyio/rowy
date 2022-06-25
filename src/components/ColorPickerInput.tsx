import {
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  useLayoutEffect,
} from "react";
import { Box } from "@mui/material";

import { fieldSx } from "@src/components/SideDrawer/utils";
import { Color, ColorPicker } from "react-color-palette";
import { useDebouncedCallback } from "use-debounce";

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
  handleOnChangeComplete: (color: Color) => void;
  disabled?: boolean;
}

export default function ColorPickerInput({
  value,
  handleOnChangeComplete,
  disabled = false,
}: IColorPickerProps) {
  const [localValue, setLocalValue] = useState(value);
  const [width, setRef] = useResponsiveWidth();

  const debouncedOnChangeComplete = useDebouncedCallback((color) => {
    handleOnChangeComplete(color);
  }, 100);

  useEffect(() => {
    debouncedOnChangeComplete(localValue);
  }, [debouncedOnChangeComplete, localValue]);

  return (
    <Box
      ref={setRef}
      sx={[
        fieldSx,
        {
          marginTop: "1rem",
          padding: "1rem",
          borderColor: "divider",
          transitionDuration: 0,
          "& .rcp": {
            border: "none",
            "& .rcp-saturation": {
              borderRadius: "4px",
            },
            "& .rcp-body": {
              boxSizing: "unset",
            },
          },
        },
      ]}
    >
      <ColorPicker
        width={width}
        height={100}
        color={localValue}
        onChange={(color) => setLocalValue(color)}
      />
    </Box>
  );
}
