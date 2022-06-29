import { useEffect, useState } from "react";

import {
  Box,
  Checkbox,
  InputLabel,
  MenuItem,
  TextField,
  useTheme,
} from "@mui/material";
import ColorPickerInput from "@src/components/ColorPickerInput";
import { ISettingsProps } from "@src/components/fields/types";

import { Color, toColor } from "react-color-palette";
import { fieldSx } from "@src/components/SideDrawer/utils";
import { resultColorsScale, defaultColors } from "@src/utils/color";

const colorLabels: { [key: string]: string } = {
  0: "No",
  1: "Maybe",
  2: "Yes",
};

export default function Settings({ onChange, config }: ISettingsProps) {
  const [colorsDraft, setColorsDraft] = useState<any[]>(
    config.colors ? config.colors : defaultColors
  );

  const [checkStates, setCheckStates] = useState<boolean[]>([
    colorsDraft[0],
    colorsDraft[1],
    colorsDraft[2],
  ]);

  useEffect(() => {
    onChange("colors")(colorsDraft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorsDraft]);

  const onCheckboxChange = (index: number, checked: boolean) => {
    setColorsDraft(
      colorsDraft.map((value: any, idx: number) =>
        index === idx ? (checked ? value || defaultColors[idx] : null) : value
      )
    );
    setCheckStates(
      checkStates.map((value, idx) => (index === idx ? checked : value))
    );
  };

  const handleColorChange = (index: number, color: Color): void => {
    setColorsDraft(
      colorsDraft.map((value, idx) => (index === idx ? color.hex : value))
    );
  };

  return (
    <>
      {JSON.stringify(config)}
      {checkStates.map((checked: boolean, index: number) => {
        const colorHex = colorsDraft[index];
        return (
          <Box key={index} sx={{ display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "end",
                justifyContent: "center",
              }}
            >
              <Checkbox
                checked={checked}
                sx={[
                  fieldSx,
                  {
                    width: "auto",
                    boxShadow: "none",
                    backgroundColor: "inherit",
                    "&:hover": {
                      backgroundColor: "inherit",
                    },
                  },
                ]}
                onChange={() => onCheckboxChange(index, !checked)}
              />
              <TextField
                select
                label={colorLabels[index]}
                value={1}
                fullWidth
                disabled={!checkStates[index]}
                sx={{
                  "& .MuiMenu-list": {
                    padding: 0,
                  },
                }}
              >
                <MenuItem value={1} sx={{ display: "none" }}>
                  {checked && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          backgroundColor: colorHex,
                          width: 15,
                          height: 15,
                          mr: 1.5,
                          boxShadow: (theme) =>
                            `0 0 0 1px ${theme.palette.divider} inset`,
                          borderRadius: 0.5,
                          opacity: 0.5,
                        }}
                      />
                      <Box>{colorHex}</Box>
                    </Box>
                  )}
                </MenuItem>
                {colorHex && (
                  <>
                    <ColorPickerInput
                      value={toColor("hex", colorHex)}
                      handleOnChangeComplete={(color) =>
                        handleColorChange(index, color)
                      }
                      disabled={!checkStates[index]}
                    />
                  </>
                )}
              </TextField>
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
