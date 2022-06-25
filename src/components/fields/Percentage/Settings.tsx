import { useState } from "react";

import {
  Box,
  ButtonBase,
  Checkbox,
  Collapse,
  InputLabel,
  useTheme,
} from "@mui/material";
import ColorPickerInput from "@src/components/ColorPickerInput";
import { ISettingsProps } from "@src/components/fields/types";

import { Color, toColor } from "react-color-palette";
import { fieldSx } from "@src/components/SideDrawer/utils";
import { ChevronDown } from "mdi-material-ui";
import { ReactElement } from "react-markdown/lib/react-markdown";
import { resultColorsScale } from "@src/utils/color";

const ColorPickerCollapse = ({
  colorKey,
  color,
  active,
  setActive,
  disabled,
  children,
}: {
  colorKey: string;
  color: Color;
  active: boolean;
  setActive: (activeKey: string | null) => void;
  disabled?: boolean;
  children?: ReactElement;
}) => {
  const toggleCollapse = () => !disabled && setActive(active ? null : colorKey);

  const toggleState = (() => {
    if (disabled && active) {
      setActive(null);
      return false;
    }
    return active;
  })();

  return (
    <Box sx={{ width: "100%" }}>
      <ButtonBase
        onClick={toggleCollapse}
        component={ButtonBase}
        focusRipple
        disabled={disabled}
        sx={[
          fieldSx,
          {
            justifyContent: "flex-start",
            "&&": { pl: 0.75, pr: 0.5 },
            color: color.hex,
            transition: (theme) =>
              theme.transitions.create("border-radius", {
                delay: theme.transitions.duration.standard,
              }),
            "&.Mui-disabled": { color: "text.disabled" },
          },
          active && {
            transitionDelay: "0s",
            transitionDuration: "0s",
          },
        ]}
      >
        <Box
          sx={{
            backgroundColor: color?.hex,
            width: 15,
            height: 15,
            mr: 1.5,
            boxShadow: (theme) => `0 0 0 1px ${theme.palette.divider} inset`,
            borderRadius: 0.5,
            opacity: 0.5,
          }}
        />
        <div style={{ flexGrow: 1 }}>{color.hex}</div>
        <ChevronDown
          color="action"
          sx={{
            transition: (theme) => theme.transitions.create("transform"),
            transform: active ? "rotate(180deg)" : "none",
          }}
        />
      </ButtonBase>
      <Collapse in={toggleState}>{children}</Collapse>
    </Box>
  );
};

const defaultColors: { [key: string]: Color } = {
  default: toColor("hex", "#FFFFFF"),
  startColor: toColor("hex", "#ED4747"),
  midColor: toColor("hex", "#F3C900"),
  endColor: toColor("hex", "#1FAD5F"),
};

const colorLabels: { [key: string]: string } = {
  startColor: "Start Color",
  midColor: "Middle Color",
  endColor: "End Color",
};

export default function Settings({ onChange, config }: ISettingsProps) {
  const [checkStates, setCheckStates] = useState<{ [key: string]: boolean }>({
    startColor: Boolean(config.startColor),
    midColor: Boolean(config.midColor),
    endColor: Boolean(config.endColor),
  });
  const [activePicker, setActivePicker] = useState<string | null>(null);
  const theme = useTheme();

  const onCheckboxChange = (key: string, checked: boolean) => {
    if (!checked) {
      onChange(key)(defaultColors.default);
    } else {
      onChange(key)(defaultColors[key]);
    }
    setCheckStates({ ...checkStates, [key]: checked });
  };

  return (
    <>
      {Object.keys(checkStates).map((colorKey) => {
        const color = config[colorKey] || defaultColors[colorKey];
        return (
          <Box key={colorKey} sx={{ display: "flex", flexDirection: "column" }}>
            {colorLabels[colorKey]}
            <Box
              sx={{
                display: "flex",
                alignItems: "start",
                justifyContent: "center",
              }}
            >
              <Checkbox
                sx={[
                  fieldSx,
                  { width: "auto", marginRight: "0.5rem", boxShadow: "none" },
                ]}
                checked={checkStates[colorKey]}
                onChange={() =>
                  onCheckboxChange(colorKey, !checkStates[colorKey])
                }
              />
              <ColorPickerCollapse
                colorKey={colorKey}
                active={activePicker === colorKey}
                setActive={(activePicker) => setActivePicker(activePicker)}
                color={color}
                disabled={!checkStates[colorKey]}
              >
                <ColorPickerInput
                  value={color}
                  handleOnChangeComplete={(color) => onChange(colorKey)(color)}
                  disabled={!checkStates[colorKey]}
                />
              </ColorPickerCollapse>
            </Box>
          </Box>
        );
      })}
      <InputLabel>
        Preview:
        <Box sx={{ display: "flex", textAlign: "center" }}>
          {[0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1].map((value) => {
            const { startColor, midColor, endColor } = config;
            return (
              <Box
                key={value}
                sx={{
                  width: "100%",
                  padding: "0.5rem 0",
                  color: theme.palette.text.primary,
                  backgroundColor: resultColorsScale(value, {
                    startColor: startColor.hex,
                    midColor: midColor.hex,
                    endColor: endColor.hex,
                  }).toHex(),
                  opacity: 0.5,
                }}
              >
                {Math.floor(value * 100)}%
              </Box>
            );
          })}
        </Box>
      </InputLabel>
    </>
  );
}
