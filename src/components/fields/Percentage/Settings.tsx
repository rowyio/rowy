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

  const [checkStates, setCheckStates] = useState<{ [key: string]: boolean }>({
    0: colorsDraft[0],
    1: colorsDraft[1],
    2: colorsDraft[2],
  });

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
            <Box
              sx={{
                display: "flex",
                alignItems: "end",
                justifyContent: "center",
              }}
            >
              <Checkbox
                checked={Boolean(checkStates[key])}
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
                onChange={() => onCheckboxChange(key, !checkStates[index])}
              />
              <TextField
                select
                label={colorLabels[key]}
                value={1}
                fullWidth
                disabled={!checkStates[key]}
                sx={{
                  "& .MuiMenu-list": {
                    padding: 0,
                  },
                }}
              >
                <MenuItem value={1} sx={{ display: "none" }}>
                  {checkStates[key] && (
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
                        handleColorChange(key, color)
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
