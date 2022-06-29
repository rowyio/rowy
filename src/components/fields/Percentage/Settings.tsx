import { useEffect, useState } from "react";

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
import { resultColorsScale, defaultColors } from "@src/utils/color";

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

const colorLabels: { [key: string]: string } = {
  0: "No",
  1: "Yes",
  2: "Maybe",
};

export default function Settings({ onChange, config }: ISettingsProps) {
  const [colorsDraft, setColorsDraft] = useState<any[]>(
    config.colors ? config.colors : defaultColors
  );

  const [checkStates, setCheckStates] = useState<{ [key: string]: boolean }>({
    0: colorsDraft[0],
    1: colorsDraft[1],
    2: colorsDraft[2],
  });
  const [activePicker, setActivePicker] = useState<string | null>(null);

  useEffect(() => {
    onChange("colors")(colorsDraft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorsDraft]);

  const onCheckboxChange = (index: string, checked: boolean) => {
    setColorsDraft(
      colorsDraft.map((value: any, idx: number) =>
        Number(index) === idx
          ? checked
            ? value || defaultColors[idx]
            : null
          : value
      )
    );
    setCheckStates({ ...checkStates, [index]: checked });
  };

  const handleColorChange = (key: string, color: Color): void => {
    setColorsDraft(
      colorsDraft.map((value, index) =>
        index === Number(key) ? color.hex : value
      )
    );
  };

  return (
    <>
      {JSON.stringify(config)}
      {Object.keys(checkStates).map((key) => {
        const index = Number(key);
        const colorHex = colorsDraft[Number(key)];
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
                checked={Boolean(checkStates[key])}
                sx={[
                  fieldSx,
                  { width: "auto", marginRight: "0.5rem", boxShadow: "none" },
                ]}
                onChange={() => onCheckboxChange(key, !checkStates[index])}
              />
              <ColorPickerCollapse
                colorKey={key}
                active={activePicker === key}
                setActive={(activePicker) => setActivePicker(activePicker)}
                color={colorHex || "#fff"}
                disabled={!checkStates[index]}
              >
                {colorHex ? (
                  <ColorPickerInput
                    value={toColor("hex", colorHex)}
                    handleOnChangeComplete={(color) =>
                      handleColorChange(key, color)
                    }
                    disabled={!checkStates[index]}
                  />
                ) : (
                  <></>
                )}
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
                backgroundColor: resultColorsScale(
                  value,
                  colors,
                  theme.palette.background.paper
                ).toHex(),
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
