import { useState } from "react";
import { ISideDrawerFieldProps } from "@src/components/fields/types";
import { ColorPicker, toColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";

import { ButtonBase, Box, Collapse } from "@mui/material";
import { ChevronDown } from "@src/assets/icons";

import { fieldSx, getFieldId } from "@src/components/SideDrawer/utils";

export default function Color({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  const [showPicker, setShowPicker] = useState(false);
  const toggleOpen = () => setShowPicker((s) => !s);

  return (
    <>
      <ButtonBase
        onClick={toggleOpen}
        component={ButtonBase}
        focusRipple
        disabled={disabled}
        sx={[
          fieldSx,
          {
            justifyContent: "flex-start",
            "&&": { pl: 0.75, pr: 0.5 },
            color: value?.hex ? "textPrimary" : "textSecondary",
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
        aria-expanded={showPicker}
        aria-controls={getFieldId(column.key)}
      >
        <Box
          sx={{
            backgroundColor: value?.hex,
            width: 20,
            height: 20,
            mr: 1.5,
            boxShadow: (theme) => `0 0 0 1px ${theme.palette.divider} inset`,
            borderRadius: 0.5,
          }}
        />

        <div style={{ flexGrow: 1 }}>{value?.hex ?? "Choose a color…"}</div>

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
        id={getFieldId(column.key)}
        onBlur={onSubmit}
      >
        <ColorPicker
          width={440}
          height={180}
          color={
            value?.hex ? toColor("hex", value.hex) : toColor("hex", "#fff")
          }
          onChange={onChange}
          onChangeComplete={onSubmit}
          alpha
        />
      </Collapse>
    </>
  );
}
