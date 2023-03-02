import { FC, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import { Chip, Divider, Typography, useTheme } from "@mui/material";
import Modal from "./Modal";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FormatColorResetIcon from "@mui/icons-material/FormatColorReset";
import { paletteToMui, palette } from "@src/theme/palette";
import ColorPickerInput from "./ColorPickerInput";
import { toColor } from "react-color-palette";

interface SelectColorThemeOptions {
  light: string;
  dark: string;
}

const ColorSelect = () => {
  /* Get current */
  const theme = useTheme();
  const mode = theme.palette.mode;

  /* Palette - reset paletter to object */
  const palettes = Object({
    gray: palette.aGray,
    blue: palette.blue,
    red: palette.aRed,
    green: palette.green,
    yellow: palette.yellow,
    pink: palette.pink,
    teal: palette.teal,
    tangerine: palette.tangerine,
    orange: palette.orange,
    cyan: palette.cyan,
    amber: palette.amber,
    lightGreen: palette.lightGreen,
  });

  /* Hold the current state of a given option defaults to `default` */
  const [color, setColor] = useState<SelectColorThemeOptions>(
    paletteToMui(palette["gray"])
  );

  /* MUI Specific state */
  const [colorSelectAnchor, setColorSelectAnchor] =
    useState<null | HTMLElement>(null);
  const open = Boolean(colorSelectAnchor);

  /* MUI Menu event handlers */
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setColorSelectAnchor(event.currentTarget);
  };
  const handleClose = () => {
    setColorSelectAnchor(null);
  };

  return (
    <div>
      <Button
        sx={{ margin: "7.5px 0", width: "auto" }}
        size="small"
        id="color-picker-btn"
        aria-controls={open ? "color-picker-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="outlined"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        <Box
          m={0.5}
          sx={{
            width: 20,
            height: 20,
            borderRadius: 100,
            backgroundColor: color[mode],
          }}
        />
      </Button>

      {/* Menu */}
      <Menu
        sx={{ marginTop: 0.5 }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        id="color-picker-menu"
        MenuListProps={{
          "aria-labelledby": "color-pick-btn",
        }}
        anchorEl={colorSelectAnchor}
        open={open}
        onClose={handleClose}
      >
        <Typography
          fontSize={11}
          color="secondary"
          py={1}
          px={2}
          fontWeight="bold"
        >
          COLOURS
        </Typography>

        <Grid container py={1} px={2} columns={6} rowGap={2}>
          {Object.keys(palettes).map((key: string, index: number) => (
            <Grid item xs={1}>
              <Button
                sx={{
                  minWidth: "25px",
                  minHeight: "25px",
                  backgroundColor: paletteToMui(palettes[key])[mode],
                  borderRadius: 100,
                  "&:hover": {
                    backgroundColor: paletteToMui(palettes[key])[mode],
                  },
                }}
                size="small"
                onClick={() => setColor(paletteToMui(palettes[key]))}
                key={index}
              />
            </Grid>
          ))}
        </Grid>

        <Box pt={1} px={2}>
          <CustomSelectColor
            currentColor={color}
            onChange={(color) => setColor(color)}
          />
        </Box>

        <Box px={2} py={2}>
          <Button
            size="small"
            sx={{ borderRadius: 100 }}
            fullWidth
            startIcon={<FormatColorResetIcon />}
            onClick={() => setColor(paletteToMui(palettes["gray"]))}
          >
            Reset
          </Button>
        </Box>

        <Divider />

        <Grid container gap={1} py={1} px={2} alignItems="center">
          <Grid item>
            <Typography fontSize={13} fontWeight="light">
              Preview
            </Typography>
          </Grid>
          <Grid item>
            <Chip
              component="small"
              size="small"
              label="Option 1"
              sx={{ backgroundColor: color[mode] }}
            />
          </Grid>
        </Grid>
      </Menu>
    </div>
  );
};

interface CustomizeColor {
  currentColor: SelectColorThemeOptions;
  onChange: (value: SelectColorThemeOptions) => void;
}

const CustomSelectColor: FC<CustomizeColor> = ({ currentColor, onChange }) => {
  const [color, setColor] = useState<SelectColorThemeOptions>(currentColor);

  /* Update color value onFocus */
  useEffect(() => {
    setColor(currentColor);
  }, [currentColor]);

  /* Pass value to the onChange function */
  const handleChange = (color: SelectColorThemeOptions) => {
    setColor(color);
    onChange(color);
  };

  /* MUI Specific state */
  const [open, setOpen] = useState<boolean>(false);

  /* MUI Menu event handlers */
  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button size="small" color="success" variant="text" onClick={handleClick}>
        Customise
      </Button>
      <Modal
        title="Customize Color"
        aria-labelledby="custom-color-picker-modal"
        aria-describedby="custom-color-picker-modal"
        open={open}
        onClose={handleClose}
        disableBackdropClick
      >
        <Box display="grid" gridTemplateColumns="repeat(6, 1fr)" gap={1}>
          {/* Light Theme Customize Color */}
          <Box gridColumn="span 3">
            <ColorPickerInput
              value={toColor("hex", color.light)}
              onChangeComplete={(value) =>
                handleChange({ ...color, ...{ light: value.hex } })
              }
            />
            <Grid container gap={1} py={1} px={2} alignItems="center">
              <Grid item>
                <Typography fontSize={13} fontWeight="light">
                  Light Theme
                </Typography>
              </Grid>
              <Grid item>
                <Chip
                  component="small"
                  size="small"
                  label="Option 1"
                  sx={{ backgroundColor: color.light, color: "black" }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Dark Theme Customize Color */}
          <Box gridColumn="span 3">
            <ColorPickerInput
              value={toColor("hex", color.dark)}
              onChangeComplete={(value) =>
                handleChange({ ...color, ...{ dark: value.hex } })
              }
            />
            <Grid container gap={1} py={1} px={2} alignItems="center">
              <Grid item>
                <Typography fontSize={13} fontWeight="light">
                  Dark Theme
                </Typography>
              </Grid>
              <Grid item>
                <Chip
                  component="small"
                  size="small"
                  label="Option 1"
                  sx={{ backgroundColor: color.dark, color: "white" }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ColorSelect;
