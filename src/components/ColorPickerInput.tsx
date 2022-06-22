import { useState } from "react";
import { ButtonBase, Box, Collapse } from "@mui/material";

import { fieldSx } from "@src/components/SideDrawer/utils";
import { ChevronDown } from "@src/assets/icons/ChevronDown";
import { Color, ColorPicker } from "react-color-palette";

export interface IColorPickerProps {
  value: Color;
  handleChange: (color: Color) => void;
  handleOnChangeComplete: (color: Color) => void;
}

export default function ColorPickerInput({
  value,
  handleChange,
  handleOnChangeComplete,
}: IColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const toggleOpen = () => setShowPicker((s) => !s);
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
          width={400}
          height={100}
          color={value}
          onChange={handleChange}
          onChangeComplete={handleOnChangeComplete}
          alpha
        />
      </Collapse>
    </>
  );
}
