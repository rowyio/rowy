import { Fragment, useRef, useState } from "react";
import { useSnackbar } from "notistack";

import Navigation from "@src/layouts/Navigation";
import {
  useTheme,
  Container,
  Stack,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Fab,
  Chip,
  Paper,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ListSubheader,
  Slider,
  Tooltip,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Switch,
  TextField,
  Tabs,
  Tab,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import SparkIcon from "@mui/icons-material/OfflineBoltOutlined";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";

import CircularProgressOptical from "@src/components/CircularProgressOptical";

import CodeEditor from "@src/components/CodeEditor";
import DiffEditor from "@src/components/CodeEditor/DiffEditor";

const typographyVariants = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "subtitle1",
  "subtitle2",
  "body1",
  "body2",
  "button",
  "caption",
  "overline",
] as const;

export default function TestView() {
  const theme = useTheme();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [tab, setTab] = useState(0);
  const handleTabChange = (_: any, newTab: any) => setTab(newTab);

  const [alignment, setAlignment] = useState("left");
  const handleChangeAlignment = (_: any, v: any) => setAlignment(v);
  const toggleButtonProps = {
    value: alignment,
    onChange: handleChangeAlignment,
    exclusive: true,
    children: [
      <ToggleButton value="left" key="left">
        <FormatAlignLeftIcon />
        {/* Left */}
      </ToggleButton>,
      <ToggleButton value="center" key="center">
        <FormatAlignCenterIcon />
        {/* Center */}
      </ToggleButton>,
      <ToggleButton value="right" key="right">
        <FormatAlignRightIcon />
        {/* Right */}
      </ToggleButton>,
      <ToggleButton value="justify" key="justify">
        <FormatAlignJustifyIcon />
        {/* Justify */}
      </ToggleButton>,
    ],
  };

  return (
    <Navigation>
      <Container style={{ margin: "24px 0 200px", width: "100%" }}>
        <Stack spacing={8}>
          <Table
            stickyHeader
            style={{ overflowX: "auto", display: "block", width: "100%" }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Variant</TableCell>
                <TableCell align="right">Font Weight</TableCell>
                <TableCell align="right">Font Size</TableCell>
                <TableCell align="right">Letter Spacing</TableCell>
                <TableCell align="right">Line Height</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {typographyVariants.map((variant) => {
                const fontWeight = theme.typography[variant].fontWeight;
                const fontSizeRem = Number(
                  (theme.typography[variant].fontSize as string).replace(
                    "rem",
                    ""
                  )
                ).toFixed(5);
                const fontSizePx = Number(fontSizeRem) * 16;
                const letterSpacingEm = Number(
                  (
                    (theme.typography[variant].letterSpacing as string) ?? "0"
                  ).replace("em", "")
                ).toFixed(5);
                const letterSpacingPx = (
                  Number(letterSpacingEm) * fontSizePx
                ).toFixed(5);
                const lineHeight = Number(
                  theme.typography[variant].lineHeight
                ).toFixed(5);
                const lineHeightPx = (Number(lineHeight) * fontSizePx).toFixed(
                  5
                );

                return (
                  <Fragment key={variant}>
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        style={{
                          borderBottom: 0,
                          paddingBottom: 0,
                          letterSpacing: 0,
                          paddingRight: 0,
                        }}
                      >
                        <Typography
                          variant={variant as any}
                          noWrap
                          style={{
                            width: `calc(100vw - 80px + 16px)`,
                            textOverflow: "clip",
                            display: "block",
                          }}
                        >
                          Sphinx of black quartz, judge my vow! 1234567890
                          SPHINX OF BLACK QUARTZ, JUDGE MY VOW!
                        </Typography>
                        <Typography
                          variant={variant as any}
                          noWrap
                          style={{
                            width: `calc(100vw - 80px + 16px)`,
                            textOverflow: "clip",
                            display: "block",
                          }}
                        >
                          Judge my vow, sphinx of black quartz! 1234567890 JUDGE
                          MY VOW, SPHINX OF BLACK QUARTZ!
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow
                      sx={{
                        "& .MuiTableCell-root": {
                          fontFamily: theme.typography.fontFamilyMono,
                          color: theme.palette.text.secondary,
                        },
                      }}
                    >
                      <TableCell>
                        <br />
                        {variant}
                      </TableCell>
                      <TableCell align="right">
                        <br />
                        {fontWeight}
                      </TableCell>
                      <TableCell align="right">
                        {fontSizeRem}&nbsp;rem
                        <br />
                        {fontSizePx}&nbsp;px&nbsp;
                      </TableCell>
                      <TableCell align="right">
                        {letterSpacingEm}&nbsp;em
                        <br />
                        {letterSpacingPx}&nbsp;px
                      </TableCell>
                      <TableCell align="right">
                        {lineHeight}&nbsp;&nbsp;&nbsp;
                        <br />
                        {lineHeightPx}&nbsp;px
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>

          <Stack spacing={1} direction="row" alignItems="center">
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              color="primary"
              variant="text"
              size="small"
            >
              Button
            </Button>
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              color="primary"
              variant="text"
              size="medium"
            >
              Button
            </Button>
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              color="primary"
              variant="text"
              size="large"
            >
              Button
            </Button>

            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              color="secondary"
              variant="text"
              size="small"
            >
              Button
            </Button>
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              color="secondary"
              variant="text"
              size="medium"
            >
              Button
            </Button>
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              color="secondary"
              variant="text"
              size="large"
            >
              Button
            </Button>

            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              disabled
              variant="text"
              size="small"
            >
              Button
            </Button>
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              disabled
              variant="text"
              size="medium"
            >
              Button
            </Button>
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              disabled
              variant="text"
              size="large"
            >
              Button
            </Button>
          </Stack>

          <Stack spacing={1} direction="row" alignItems="center">
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              color="primary"
              variant="outlined"
              size="small"
            >
              Button
            </Button>
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              color="primary"
              variant="outlined"
              size="medium"
            >
              Button
            </Button>
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              color="primary"
              variant="outlined"
              size="large"
            >
              Button
            </Button>
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              color="secondary"
              variant="outlined"
              size="small"
            >
              Button
            </Button>
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              color="secondary"
              variant="outlined"
              size="medium"
            >
              Button
            </Button>
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              color="secondary"
              variant="outlined"
              size="large"
            >
              Button
            </Button>

            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              disabled
              variant="outlined"
              size="small"
            >
              Button
            </Button>
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              disabled
              variant="outlined"
              size="medium"
            >
              Button
            </Button>
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              disabled
              variant="outlined"
              size="large"
            >
              Button
            </Button>
          </Stack>

          <Stack spacing={1} direction="row" alignItems="center">
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              color="primary"
              variant="contained"
              size="small"
            >
              Button
            </Button>
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              color="primary"
              variant="contained"
              size="medium"
            >
              Button
            </Button>
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              color="primary"
              variant="contained"
              size="large"
            >
              Button
            </Button>
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              color="secondary"
              variant="contained"
              size="small"
            >
              Button
            </Button>
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              color="secondary"
              variant="contained"
              size="medium"
            >
              Button
            </Button>
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              color="secondary"
              variant="contained"
              size="large"
            >
              Button
            </Button>

            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              disabled
              variant="contained"
              size="small"
            >
              Button
            </Button>
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              disabled
              variant="contained"
              size="medium"
            >
              Button
            </Button>
            <Button
              // startIcon={<SparkIcon />}
              // endIcon={<SparkIcon />}
              disabled
              variant="contained"
              size="large"
            >
              Button
            </Button>
          </Stack>

          <Stack spacing={1} direction="row" alignItems="center">
            <ToggleButtonGroup
              color="standard"
              size="small"
              {...toggleButtonProps}
            />
            <ToggleButtonGroup
              color="primary"
              size="medium"
              {...toggleButtonProps}
            />
            <ToggleButtonGroup
              color="secondary"
              size="large"
              {...toggleButtonProps}
            />
            <ToggleButtonGroup
              color="primary"
              size="large"
              {...toggleButtonProps}
              disabled
            />
          </Stack>

          <Stack spacing={1} direction="row" alignItems="center">
            <ToggleButtonGroup
              orientation="vertical"
              color="standard"
              size="small"
              {...toggleButtonProps}
            />
            <ToggleButtonGroup
              orientation="vertical"
              color="primary"
              size="medium"
              {...toggleButtonProps}
            />
            <ToggleButtonGroup
              orientation="vertical"
              color="secondary"
              size="large"
              {...toggleButtonProps}
            />
            <ToggleButtonGroup
              orientation="vertical"
              color="primary"
              size="large"
              {...toggleButtonProps}
              disabled
            />
          </Stack>

          <Stack spacing={1} direction="row" alignItems="center">
            <IconButton size="small">
              <SparkIcon />
            </IconButton>
            <IconButton size="medium">
              <SparkIcon />
            </IconButton>
            <IconButton size="large">
              <SparkIcon />
            </IconButton>
            <IconButton color="primary" size="small">
              <SparkIcon />
            </IconButton>
            <IconButton color="primary" size="medium">
              <SparkIcon />
            </IconButton>
            <IconButton color="primary" size="large">
              <SparkIcon />
            </IconButton>
            <IconButton color="secondary" size="small">
              <SparkIcon />
            </IconButton>
            <IconButton color="secondary" size="medium">
              <SparkIcon />
            </IconButton>
            <IconButton color="secondary" size="large">
              <SparkIcon />
            </IconButton>
            <IconButton disabled size="small">
              <SparkIcon />
            </IconButton>
            <IconButton disabled size="medium">
              <SparkIcon />
            </IconButton>
            <IconButton disabled size="large">
              <SparkIcon />
            </IconButton>
          </Stack>

          <Stack spacing={1} direction="row" alignItems="center">
            <Fab size="small">
              <SparkIcon />
            </Fab>
            <Fab size="medium">
              <SparkIcon />
            </Fab>
            <Fab size="large">
              <SparkIcon />
            </Fab>
            <Fab color="primary" size="small">
              <SparkIcon />
            </Fab>
            <Fab color="primary" size="medium">
              <SparkIcon />
            </Fab>
            <Fab color="primary" size="large">
              <SparkIcon />
            </Fab>
            <Fab color="secondary" size="small">
              <SparkIcon />
            </Fab>
            <Fab color="secondary" size="medium">
              <SparkIcon />
            </Fab>
            <Fab color="secondary" size="large">
              <SparkIcon />
            </Fab>
            <Fab disabled size="small">
              <SparkIcon />
            </Fab>
            <Fab disabled size="medium">
              <SparkIcon />
            </Fab>
            <Fab disabled size="large">
              <SparkIcon />
            </Fab>
          </Stack>

          <Stack spacing={1} direction="row" alignItems="center">
            <Chip clickable variant="filled" size="small" label="Main" />
            <Chip clickable variant="filled" size="medium" label="Main" />
            <Chip
              clickable
              variant="filled"
              size="medium"
              label={
                <>
                  Main
                  <br />
                  Multiline
                </>
              }
            />
            <Chip
              clickable
              variant="filled"
              color="primary"
              size="small"
              label="Main"
            />
            <Chip
              clickable
              variant="filled"
              color="primary"
              size="medium"
              label="Main"
            />
            <Chip
              clickable
              variant="filled"
              color="primary"
              size="medium"
              label={
                <>
                  Main
                  <br />
                  Multiline
                </>
              }
            />
            <Chip
              clickable
              variant="filled"
              color="secondary"
              size="small"
              label="Main"
            />
            <Chip
              clickable
              variant="filled"
              color="secondary"
              size="medium"
              label="Main"
            />
            <Chip
              clickable
              variant="filled"
              color="secondary"
              size="medium"
              label={
                <>
                  Main
                  <br />
                  Multiline
                </>
              }
            />
          </Stack>

          <Stack spacing={1} direction="row" alignItems="center">
            <Chip clickable variant="outlined" size="small" label="Main" />
            <Chip clickable variant="outlined" size="medium" label="Main" />
            <Chip
              clickable
              variant="outlined"
              size="medium"
              label={
                <>
                  Main
                  <br />
                  Multiline
                </>
              }
            />
            <Chip
              clickable
              variant="outlined"
              color="primary"
              size="small"
              label="Main"
            />
            <Chip
              clickable
              variant="outlined"
              color="primary"
              size="medium"
              label="Main"
            />
            <Chip
              clickable
              variant="outlined"
              color="primary"
              size="medium"
              label={
                <>
                  Main
                  <br />
                  Multiline
                </>
              }
            />
            <Chip
              clickable
              variant="outlined"
              color="secondary"
              size="small"
              label="Main"
            />
            <Chip
              clickable
              variant="outlined"
              color="secondary"
              size="medium"
              label="Main"
            />
            <Chip
              clickable
              variant="outlined"
              color="secondary"
              size="medium"
              label={
                <>
                  Main
                  <br />
                  Multiline
                </>
              }
            />
          </Stack>

          <Stack spacing={1} direction="row" alignItems="flex-start">
            <TextField id="1" label="Label" placeholder="Placeholder" />
            <TextField id="2" label="Label" defaultValue="Default Value" />
            <TextField
              id="3"
              label="Hidden Label"
              placeholder="Placeholder"
              hiddenLabel
            />
            <TextField id="4" label="Label" />
            <TextField id="5" label="Label" error helperText="Helper Text" />
            <TextField id="6" label="Disabled" disabled />
            <TextField
              id="long"
              label="Label"
              placeholder="Placeholder"
              multiline
            />
          </Stack>

          <TextField
            id="longLabel"
            label="Long Label Long Label Long Label Long Label Long Label Long Label Long Label Long Label Long Label Long Label Long Label Long Label Long Label Long Label Long Label Long Label Long Label Long Label Long Label Long Label Long Label Long Label Long Label Long Label"
            placeholder="Placeholder"
            fullWidth
          />

          <Paper elevation={8} style={{ width: "min-content" }}>
            <MenuList sx={{ pt: 0.5, pb: 0.5 }}>
              <MenuItem>Profile</MenuItem>
              <MenuItem>My account</MenuItem>
              <MenuItem selected>Selected</MenuItem>
              <Divider variant="middle" />
              <ListSubheader>Subheader</ListSubheader>
              <MenuItem>Profile</MenuItem>
              <MenuItem>My account</MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <SparkIcon />
                </ListItemIcon>
                <ListItemText primary="With Icon" />
              </MenuItem>
              <Divider variant="middle" />
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Paper>

          <div>
            <Grid container spacing={4}>
              {new Array(24).fill(undefined).map((_, i) => (
                <Grid item key={i}>
                  <Paper
                    elevation={i + 1}
                    style={{
                      width: 200,
                      height: 200,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {i + 1}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </div>

          <Tooltip open title="Tooltip">
            <Slider
              valueLabelDisplay="on"
              // valueLabelFormat={(v) => `${v} label`}
              marks={[
                { value: 20, label: 20 },
                { value: 40, label: 40 },
              ]}
              defaultValue={30}
            />
          </Tooltip>

          <Slider
            valueLabelDisplay="on"
            // valueLabelFormat={(v) => `${v} label`}
            marks={[
              { value: 20, label: 20 },
              { value: 40, label: 40 },
            ]}
            defaultValue={30}
            disabled
          />

          <Stack>
            <FormControlLabel control={<Checkbox />} label="Label" />
            <FormControlLabel
              control={<Checkbox indeterminate />}
              label="Label indeterminate"
            />
            <RadioGroup>
              <FormControlLabel control={<Radio />} value="1" label="Label 1" />
              <FormControlLabel control={<Radio />} value="2" label="Label 2" />
            </RadioGroup>
          </Stack>

          <div>
            <FormControlLabel control={<Switch />} label="Label" />
            <FormControlLabel
              control={<Switch size="medium" />}
              label="Label"
            />
            <FormControlLabel
              labelPlacement="start"
              control={<Switch />}
              label="Label"
              sx={{
                alignItems: "center",
                "& .MuiFormControlLabel-label": { mt: 0 },
              }}
            />
            <FormControlLabel
              labelPlacement="start"
              control={<Switch size="medium" />}
              label="Label"
            />
          </div>

          <Stack spacing={1} direction="row" alignItems="center">
            <Switch size="medium" color="primary" />
            <Switch size="medium" color="secondary" />
            <Switch size="medium" color="success" />
            <Switch size="small" color="primary" />
            <Switch size="small" color="secondary" />
            <Switch size="small" color="success" />
          </Stack>
          <Stack spacing={1} direction="row" alignItems="center">
            <Switch size="medium" checked color="primary" />
            <Switch size="medium" checked color="secondary" />
            <Switch size="medium" checked color="success" />
            <Switch size="small" checked color="primary" />
            <Switch size="small" checked color="secondary" />
            <Switch size="small" checked color="success" />
          </Stack>
          <Stack spacing={1} direction="row" alignItems="center">
            <Switch size="medium" disabled color="primary" />
            <Switch size="medium" disabled color="secondary" />
            <Switch size="medium" disabled color="success" />
            <Switch size="small" disabled color="primary" />
            <Switch size="small" disabled color="secondary" />
            <Switch size="small" disabled color="success" />
          </Stack>
          <Stack spacing={1} direction="row" alignItems="center">
            <Switch size="medium" checked disabled color="primary" />
            <Switch size="medium" checked disabled color="secondary" />
            <Switch size="medium" checked disabled color="success" />
            <Switch size="small" checked disabled color="primary" />
            <Switch size="small" checked disabled color="secondary" />
            <Switch size="small" checked disabled color="success" />
          </Stack>

          <Tabs value={tab} onChange={handleTabChange}>
            <Tab label="Item One" />
            <Tab label="Item Two" />
            <Tab label="Item Three" />
          </Tabs>

          <div style={{ width: 100 }}>
            <Tabs orientation="vertical" value={tab} onChange={handleTabChange}>
              <Tab label="Item One" />
              <Tab label="Item Two" />
              <Tab label="Item Three" />
            </Tabs>
          </div>

          {/* <div>
            <Button
              onClick={() =>
                requestConfirmation({
                  body: "Additional information here",
                  handleConfirm: () => alert("Confirmed!"),
                })
              }
            >
              Confirmation
            </Button>
          </div> */}

          <Stack spacing={1} direction="row" flexWrap="wrap">
            <Button onClick={() => enqueueSnackbar("Message")}>Snackbar</Button>
            <Button
              onClick={() =>
                enqueueSnackbar(
                  "You do not have the permissions to make this change.",
                  {
                    variant: "error",
                    action: (
                      <Button variant="contained" color="secondary">
                        OK
                      </Button>
                    ),
                  }
                )
              }
            >
              Error
            </Button>
            <Button
              onClick={() => enqueueSnackbar("Message", { variant: "info" })}
            >
              Info
            </Button>
            <Button
              onClick={() => enqueueSnackbar("Message", { variant: "success" })}
            >
              Success
            </Button>
            <Button
              onClick={() => enqueueSnackbar("Message", { variant: "warning" })}
            >
              Warning
            </Button>
            {/* <Button
              onClick={() => {
                const snackId = enqueueSnackbar("Downloading files", {
                  action: <SnackbarProgress stateRef={snackbarProgressRef} />,
                  persist: true,
                });

                const interval = setInterval(
                  () =>
                    snackbarProgressRef.current?.setProgress((p) => {
                      if (p === 100) {
                        clearInterval(interval);
                        setTimeout(() => closeSnackbar(snackId), 1000);
                      }
                      return p + 1;
                    }),
                  100
                );
              }}
            >
              Progress
            </Button> */}
          </Stack>

          <Stack spacing={1} direction="row" alignItems="flex-end">
            {/* size 40 thickness 3.6 */}
            <CircularProgress />
            <CircularProgress size={30} thickness={4.2} />
            <CircularProgress size={24} thickness={4.8} />
            <CircularProgress size={20} thickness={5.4} />
            <CircularProgress size={16} thickness={6.3} />
            <CircularProgress size={12} thickness={7.8} />
          </Stack>

          <Stack spacing={1} direction="row" alignItems="flex-end">
            {/* size 40 thickness 3.6 */}
            <CircularProgressOptical />
            <CircularProgressOptical size={30} />
            <CircularProgressOptical size={24} />
            <CircularProgressOptical size={20} />
            <CircularProgressOptical size={16} />
            <CircularProgressOptical size={12} />
          </Stack>

          <LinearProgress />

          <CodeEditor value={`x\n`} />
          <DiffEditor original={`x\n`} modified="y" />
        </Stack>
      </Container>
    </Navigation>
  );
}
