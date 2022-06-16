import { useState } from "react";
import { colord } from "colord";
import { ColorPicker, toColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";

import { Grid, Typography, Stack, Box, Button } from "@mui/material";
import PassIcon from "@mui/icons-material/Check";
import FailIcon from "@mui/icons-material/Error";

import { PRIMARY, DARK_PRIMARY } from "@src/theme/colors";
import themes from "theme";

export interface IThemeColorPickerProps {
  currentLight?: string;
  currentDark?: string;
  handleSave: ({ light, dark }: { light: string; dark: string }) => void;
}

export default function ThemeColorPicker({
  currentLight = PRIMARY,
  currentDark = DARK_PRIMARY,
  handleSave,
}: IThemeColorPickerProps) {
  const [light, setLight] = useState(currentLight);
  const [dark, setDark] = useState(currentDark);

  const lightTheme = themes.light({});
  const darkTheme = themes.dark({});

  return (
    <>
      <Grid container spacing={2} style={{ marginTop: 0 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" component="h3" gutterBottom>
            Light theme
          </Typography>
          <ColorPicker
            width={244}
            height={140}
            color={toColor("hex", light)}
            onChange={(c) => setLight(c.hex)}
          />

          <Stack
            spacing={0}
            sx={{ mt: 2, borderRadius: 1, overflow: "hidden" }}
          >
            <Swatch
              backgroundColor={light}
              textColor={lightTheme.palette.getContrastText(light)}
            />
            <Swatch
              backgroundColor={colord(lightTheme.palette.background.paper)
                .mix(
                  light,
                  lightTheme.palette.action.selectedOpacity +
                    lightTheme.palette.action.focusOpacity
                )
                .alpha(1)
                .toHslString()}
              textColor={lightTheme.palette.text.primary}
            />
            <Swatch
              backgroundColor={colord(lightTheme.palette.background.default)
                .mix(light, lightTheme.palette.action.hoverOpacity)
                .alpha(1)
                .toHslString()}
              textColor={light}
            />
            <Swatch
              backgroundColor={lightTheme.palette.background.default}
              textColor={light}
            />
            <Swatch
              backgroundColor={lightTheme.palette.background.paper}
              textColor={light}
            />
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" component="h3" gutterBottom>
            Dark theme
          </Typography>
          <ColorPicker
            width={244}
            height={140}
            color={toColor("hex", dark)}
            onChange={(c: any) => setDark(c.hex)}
          />

          <Stack
            spacing={0}
            sx={{ mt: 2, borderRadius: 1, overflow: "hidden" }}
          >
            <Swatch
              backgroundColor={dark}
              textColor={darkTheme.palette.getContrastText(dark)}
            />
            <Swatch
              backgroundColor={colord(darkTheme.palette.background.paper)
                .mix("#fff", 0.16)
                .mix(
                  dark,
                  darkTheme.palette.action.selectedOpacity +
                    darkTheme.palette.action.focusOpacity
                )
                .alpha(1)
                .toHslString()}
              textColor={darkTheme.palette.text.primary}
            />
            <Swatch
              backgroundColor={colord(darkTheme.palette.background.paper)
                .mix("#fff", 0.16)
                .mix(dark, darkTheme.palette.action.hoverOpacity)
                .alpha(1)
                .toHslString()}
              textColor={dark}
            />
            <Swatch
              backgroundColor={colord(darkTheme.palette.background.paper)
                .mix("#fff", 0.16)
                .alpha(1)
                .toHslString()}
              textColor={dark}
            />
            <Swatch
              backgroundColor={darkTheme.palette.background.default}
              textColor={dark}
            />
          </Stack>
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 2,
          position: "sticky",
          bottom: (theme) => theme.spacing(2),
          borderRadius: 1,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "#1C1E21"
              : theme.palette.background.paper,
          boxShadow: (theme) =>
            `0 0 0 16px ${
              theme.palette.mode === "dark"
                ? "#1C1E21"
                : theme.palette.background.paper
            }`,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={() => handleSave({ light, dark })}
          disabled={light === currentLight && dark === currentDark}
        >
          Save
        </Button>
      </Box>
    </>
  );
}

function Swatch({ backgroundColor, textColor }: Record<string, string>) {
  if (colord(textColor).alpha() < 1)
    textColor = colord(backgroundColor)
      .mix(textColor, colord(textColor).alpha())
      .alpha(1)
      .toHslString();

  const contrast = colord(backgroundColor).contrast(textColor);
  const AAA = colord(backgroundColor).isReadable(textColor, { level: "AAA" });
  const AA = colord(backgroundColor).isReadable(textColor, { level: "AA" });

  return (
    <Box
      sx={{
        bgcolor: backgroundColor,
        color: textColor,
        p: 1,
        pr: 1.5,
        typography: "button",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontVariantNumeric: "tabular-nums",
        textAlign: "right",
      }}
    >
      <Box
        component="span"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          height: 24,
          pl: 1,
          pr: 0.75,
          borderRadius: 0.5,
          bgcolor: AAA || AA ? "transparent" : "error.main",
          color: AAA || AA ? "inherit" : "error.contrastText",

          "& svg": {
            fontSize: "1.125rem",
            ml: -0.5,
            mr: 0.5,
          },
        }}
      >
        {AAA || AA ? <PassIcon /> : <FailIcon />}
        {AAA ? "AAA" : AA ? "AA" : "FAIL"}
      </Box>

      {contrast.toFixed(2)}
    </Box>
  );
}
