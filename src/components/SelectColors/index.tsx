import { FC, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import { Chip, Divider, Typography, useTheme } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FormatColorResetIcon from "@mui/icons-material/FormatColorReset";
import { paletteToMui, palette } from "@src/theme/palette";
import CustomizeColorModal from "./CustomizeColorModal";

export interface SelectColorThemeOptions {
  light: string;
  dark: string;
}

interface IColorSelect {
  handleChange: (value: SelectColorThemeOptions) => void;
  initialValue: SelectColorThemeOptions;
}

const ColorSelect: FC<IColorSelect> = ({ handleChange, initialValue }) => {
  /* Get current theme */
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
    lightBlue: palette.lightBlue,
    purple: palette.purple,
  });

  /* Hold the current state of a given option defaults to `gray` from the color palette */
  const [color, setColor] = useState<SelectColorThemeOptions>(
    initialValue || paletteToMui(palette["gray"])
  );

  const onChange = (color: SelectColorThemeOptions) => {
    setColor(color);
    handleChange(color);
  };

  /* MUI Specific state for color context menu */
  const [colorSelectAnchor, setColorSelectAnchor] =
    useState<null | HTMLElement>(null);
  const open = Boolean(colorSelectAnchor);

  /* MUI Menu event handlers for color context menu */
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

        <Grid
          container
          py={1}
          px={2}
          rowGap={2}
          columnGap={2}
          display="grid"
          gridTemplateColumns="repeat(7, auto)"
        >
          {Object.keys(palettes).map((key: string, index: number) => (
            <Grid item xs sx={{ maxWidth: "fit-content" }}>
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
                onClick={() => onChange(paletteToMui(palettes[key]))}
                key={index}
              />
            </Grid>
          ))}
        </Grid>

        <Box pt={1} px={2}>
          <CustomizeColorModal
            currentColor={color}
            onChange={(color) => onChange(color)}
          />
        </Box>

        <Box px={2} py={2}>
          <Button
            size="small"
            sx={{ borderRadius: 100 }}
            fullWidth
            startIcon={<FormatColorResetIcon />}
            onClick={() => onChange(paletteToMui(palettes["gray"]))}
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

export default ColorSelect;
