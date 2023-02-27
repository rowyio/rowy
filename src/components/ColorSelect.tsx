import { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import { Chip, Divider, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FormatColorResetIcon from "@mui/icons-material/FormatColorReset";

const MUIColorsArray = [
  "primary",
  "secondary",
  "info",
  "success",
  "error",
  "warning",
];

const ColorSelect = () => {
  /* Hold the current state of a given option defaults to `default` */
  const [color, setColor] = useState<string>("primary");

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
            backgroundColor: `${color}.main`,
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

        <Grid container gap={2} py={1} px={2}>
          {MUIColorsArray.map((color_string: string, index: number) => (
            <Grid item xs={1}>
              <Button
                sx={{
                  minWidth: "20px",
                  minHeight: "20px",
                  backgroundColor: `${color_string}.main`,
                  color: `${color_string}.contrastText`,
                  borderRadius: 100,
                  outline: color === color_string ? `gray solid 2px` : "none",
                  outlineOffset: "1px",
                  "&:hover": {
                    backgroundColor: `${color_string}.main`,
                    color: `${color_string}.contrastText`,
                  },
                }}
                size="small"
                value={color_string}
                onClick={() => setColor(color_string)}
                key={index}
              />
            </Grid>
          ))}
        </Grid>

        <Box px={2} py={2}>
          <Button
            size="small"
            sx={{ borderRadius: 100 }}
            fullWidth
            startIcon={<FormatColorResetIcon />}
            onClick={() => setColor("primary")}
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
              color={color as any}
            />
          </Grid>
        </Grid>
      </Menu>
    </div>
  );
};

export default ColorSelect;
