import { FC, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Chip, Typography } from "@mui/material";
import Modal from "@src/components/Modal";
import ColorPickerInput from "@src/components/ColorPickerInput";
import { toColor } from "react-color-palette";
import { SelectColorThemeOptions } from ".";

interface CustomizeColor {
  currentColor: SelectColorThemeOptions;
  onChange: (value: SelectColorThemeOptions) => void;
}

const CustomizeColorModal: FC<CustomizeColor> = ({
  currentColor,
  onChange,
}) => {
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

export default CustomizeColorModal;
