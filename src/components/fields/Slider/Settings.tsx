import { useState } from "react";

import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  Checkbox,
  Grid,
  InputLabel,
  Typography,
  useTheme,
} from "@mui/material";
import ColorPickerInput from "@src/components/ColorPickerInput";
import { ISettingsProps } from "@src/components/fields/types";

import { Color, toColor } from "react-color-palette";
import { fieldSx } from "@src/components/SideDrawer/utils";
import { resultColorsScale, defaultColors } from "@src/utils/color";

const colorLabels: { [key: string]: string } = {
  0: "Start",
  1: "Middle",
  2: "End",
};

export default function Settings({ onChange, config }: ISettingsProps) {
  const colors: string[] = config.colors ?? defaultColors;

  const [checkStates, setCheckStates] = useState<boolean[]>(
    colors.map(Boolean)
  );

  const onCheckboxChange = (index: number, checked: boolean) => {
    onChange("colors")(
      colors.map((value: any, idx: number) =>
        index === idx ? (checked ? value || defaultColors[idx] : null) : value
      )
    );
    setCheckStates(
      checkStates.map((value, idx) => (index === idx ? checked : value))
    );
  };

  const handleColorChange = (index: number, color: Color): void => {
    onChange("colors")(
      colors.map((value, idx) => (index === idx ? color.hex : value))
    );
  };

  return (
    <>
      <TextField
        variant="filled"
        fullWidth
        margin="none"
        onChange={(e) => onChange("min")(parseFloat(e.target.value))}
        value={config["min"]}
        id={`settings-field-min`}
        label="Minimum value"
        type="number"
      />

      <TextField
        variant="filled"
        fullWidth
        margin="none"
        onChange={(e) => onChange("max")(parseFloat(e.target.value))}
        value={config["max"]}
        id={`settings-field-max`}
        label="Maximum value"
        type="number"
      />

      <TextField
        variant="filled"
        fullWidth
        margin="none"
        onChange={(e) => onChange("step")(parseFloat(e.target.value))}
        value={config["step"]}
        id={`settings-field-step`}
        label="Step value"
        type="number"
      />

      <FormControlLabel
        control={
          <Switch
            checked={config.marks}
            onChange={() => onChange("marks")(!Boolean(config.marks))}
            name="marks"
          />
        }
        label="Show slider steps"
      />

      <Grid container>
        {checkStates.map((checked: boolean, index: number) => {
          const colorHex = colors[index];
          return (
            <Grid
              xs={12}
              md={4}
              item
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
                  <div>
                    <ColorPickerInput
                      value={toColor("hex", colorHex)}
                      onChangeComplete={(color) =>
                        handleColorChange(index, color)
                      }
                      disabled={!checkStates[index]}
                    />
                  </div>
                )}
              </TextField>
            </Grid>
          );
        })}
      </Grid>
      <Preview colors={config.colors} />
    </>
  );
}

const Preview = ({ colors }: { colors: any }) => {
  const theme = useTheme();
  return (
    <InputLabel>
      Preview:
      <Box
        sx={{
          display: "flex",
          textAlign: "center",
        }}
      >
        {[0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1].map((value) => {
          return (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                padding: "0.5rem 0",
                color: theme.palette.text.primary,
              }}
            >
              <Box
                key={value}
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: resultColorsScale(
                    value,
                    colors,
                    theme.palette.background.paper
                  ).toHex(),
                  opacity: 0.5,
                }}
              />
              <Typography style={{ position: "relative", zIndex: 1 }}>
                {value * 100}%
              </Typography>
            </Box>
          );
        })}
      </Box>
    </InputLabel>
  );
};
