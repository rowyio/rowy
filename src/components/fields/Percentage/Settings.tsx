import { useRef, useState } from "react";

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
  color: string;
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
            color: color,
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
            backgroundColor: color,
            width: 15,
            height: 15,
            mr: 1.5,
            boxShadow: (theme) => `0 0 0 1px ${theme.palette.divider} inset`,
            borderRadius: 0.5,
            opacity: 0.5,
          }}
        />
        <div style={{ flexGrow: 1 }}>{color}</div>
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

const defaultColors: { [key: string]: string } = {
  0: "#ED4747",
  1: "#F3C900",
  2: "#1FAD5F",
};

const colorLabels: { [key: string]: string } = {
  0: "No",
  1: "Yes",
  2: "Maybe",
};

export default function Settings({ onChange, config }: ISettingsProps) {
  const { current: colorsDraft } = useRef<any>([]);
  const [checkStates, setCheckStates] = useState<{ [key: string]: boolean }>({
    0: false,
    1: false,
    2: false,
  });
  const [activePicker, setActivePicker] = useState<string | null>(null);

  const onCheckboxChange = (key: string, checked: boolean) => {
    if (checked) {
      colorsDraft[key] = defaultColors[key];
      onChange("colors")(colorsDraft);
    } else {
      colorsDraft[key] = null;
      onChange("colors")(colorsDraft);
    }
    setCheckStates({ ...checkStates, [key]: checked });
  };

  const handleOnChange = (key: string, color: Color): void => {
    colorsDraft[key] = color.hex;
    onChange("colors")(colorsDraft);
  };

  return (
    <>
      {JSON.stringify(config)}
      {Object.keys(checkStates).map((key) => {
        const color = defaultColors[key];
        return (
          <Box key={key} sx={{ display: "flex", flexDirection: "column" }}>
            {colorLabels[key]}
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
                checked={checkStates[key]}
                onChange={() => onCheckboxChange(key, !checkStates[key])}
              />
              <ColorPickerCollapse
                colorKey={key}
                active={activePicker === key}
                setActive={(activePicker) => setActivePicker(activePicker)}
                color={color}
                disabled={!checkStates[key]}
              >
                <ColorPickerInput
                  value={toColor("hex", color)}
                  handleOnChangeComplete={(color) => handleOnChange(key, color)}
                  disabled={!checkStates[key]}
                />
              </ColorPickerCollapse>
            </Box>
          </Box>
        );
      })}
      <Preview colors={config.colors} />
    </>
  );
}

const Preview = ({ colors }: { colors: any }) => {
  const theme = useTheme();
  return (
    <InputLabel>
      Preview:
      <Box sx={{ display: "flex", textAlign: "center" }}>
        {[0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1].map((value) => {
          return (
            <Box
              key={value}
              sx={{
                width: "100%",
                padding: "0.5rem 0",
                color: theme.palette.text.primary,
                backgroundColor: resultColorsScale(value, colors).toHex(),
                opacity: 0.5,
              }}
            >
              {Math.floor(value * 100)}%
            </Box>
          );
        })}
      </Box>
    </InputLabel>
  );
};
