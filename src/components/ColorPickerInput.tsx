import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  MutableRefObject,
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

export default function ColorPickerInput({
  value,
  handleOnChangeComplete,
}: IColorPickerProps) {
  const [localValue, setLocalValue] = useState(value);
  const [showPicker, setShowPicker] = useState(false);
  const [width, setWidth] = useState(100);
  const parentRef: MutableRefObject<HTMLElement | null> = useRef(null);

  useLayoutEffect(() => {
    if (!parentRef || !parentRef.current) {
      return;
    }
    setWidth(parentRef!.current!.offsetWidth);
  }, [parentRef]);

  useEffect(() => {
    const resizeListener = () => {
      if (!parentRef || !parentRef.current) {
        return;
      }
      debouncedSetWidth(parentRef.current.offsetWidth);
    };
    window.addEventListener("resize", resizeListener);

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  useEffect(() => {
    debouncedOnChangeComplete(localValue);
  }, [localValue]);

  const toggleOpen = () => setShowPicker((s) => !s);

  const debouncedOnChangeComplete = useDebouncedCallback((color) => {
    handleOnChangeComplete(color);
  }, 400);

  const debouncedSetWidth = useDebouncedCallback(
    (width) => setWidth(width),
    400
  );

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
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
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

      <Collapse
        ref={parentRef}
        in={showPicker}
        sx={{
          "& .rcp": {
            borderTop: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            "& .rcp-saturation": {
              borderRadius: 0,
            },
          },
        }}
      >
        <ColorPicker
          width={width}
          height={100}
          color={localValue}
          onChange={(color) => setLocalValue(color)}
          alpha
        />
      </Collapse>
    </>
  );
}
