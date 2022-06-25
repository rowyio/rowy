import {
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  useLayoutEffect,
} from "react";
import { ButtonBase, Box, Collapse } from "@mui/material";

import { fieldSx } from "@src/components/SideDrawer/utils";
import { ChevronDown } from "@src/assets/icons/ChevronDown";
import { Color, ColorPicker } from "react-color-palette";
import { useDebouncedCallback } from "use-debounce";

export interface IColorPickerProps {
  value: Color;
  handleOnChangeComplete: (color: Color) => void;
}

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

export default function ColorPickerInput({
  value,
  handleOnChangeComplete,
}: IColorPickerProps) {
  const [localValue, setLocalValue] = useState(value);
  const [showPicker, setShowPicker] = useState(false);
  const [width, setRef] = useResponsiveWidth();

  const toggleOpen = () => setShowPicker((s) => !s);

  const debouncedOnChangeComplete = useDebouncedCallback((color) => {
    handleOnChangeComplete(color);
  }, 100);

  useEffect(() => {
    debouncedOnChangeComplete(localValue);
  }, [debouncedOnChangeComplete, localValue]);

  return (
    <>
      <ButtonBase
        onClick={toggleOpen}
        component={ButtonBase}
        focusRipple
        sx={[
          fieldSx,
          {
            justifyContent: "flex-start",
            "&&": { pl: 0.75, pr: 0.5 },
            color: value.hex,
            transition: (theme) =>
              theme.transitions.create("border-radius", {
                delay: theme.transitions.duration.standard,
              }),
            "&.Mui-disabled": { color: "text.disabled" },
          },
          showPicker && {
            transitionDelay: "0s",
            transitionDuration: "0s",
          },
        ]}
      >
        <Box
          sx={{
            backgroundColor: value.hex,
            width: 15,
            height: 15,
            mr: 1.5,
            boxShadow: (theme) => `0 0 0 1px ${theme.palette.divider} inset`,
            borderRadius: 0.5,
          }}
        />

        <div style={{ flexGrow: 1 }}>{value.hex}</div>

        <ChevronDown
          color="action"
          sx={{
            transition: (theme) => theme.transitions.create("transform"),
            transform: showPicker ? "rotate(180deg)" : "none",
          }}
        />
      </ButtonBase>

      <Collapse in={showPicker}>
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
      </Collapse>
    </>
  );
}
