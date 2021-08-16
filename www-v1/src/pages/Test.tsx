import { useContext, useEffect, Fragment } from "react";
import { SnackContext } from "contexts/SnackContext";

import Navigation from "components/Navigation";
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
  Chip,
  Paper,
  MenuList,
  MenuItem,
  Divider,
  ListSubheader,
  Slider,
  Tooltip,
  Switch,
  TextField,
} from "@material-ui/core";

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
];

export default function TestView() {
  const snackContext = useContext(SnackContext);
  const theme = useTheme();

  useEffect(() => {
    // alert("OPEN");
    snackContext.open({
      variant: "progress",
      message: "Preparing files for download",
      duration: undefined,
    });

    snackContext.setProgress({ value: 90, target: 120 });
  }, []);

  return (
    <Navigation tableCollection="">
      <Container style={{ margin: "24px 0 200px" }}>
        <Stack spacing={8}>
          <Table stickyHeader>
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
                  theme.typography[variant].fontSize.replace("rem", "")
                ).toFixed(5);
                const fontSizePx = Number(fontSizeRem) * 16;
                const letterSpacingEm = Number(
                  (theme.typography[variant].letterSpacing ?? "0").replace(
                    "em",
                    ""
                  )
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
            <Button size="small">Button</Button>
            <Button size="medium">Button</Button>
            <Button size="large">Button</Button>

            <Button color="secondary" size="small">
              Button
            </Button>
            <Button color="secondary" size="medium">
              Button
            </Button>
            <Button color="secondary" size="large">
              Button
            </Button>

            <Button disabled size="small">
              Button
            </Button>
            <Button disabled size="medium">
              Button
            </Button>
            <Button disabled size="large">
              Button
            </Button>
          </Stack>

          <Stack spacing={1} direction="row" alignItems="center">
            <Button variant="outlined" size="small">
              Button
            </Button>
            <Button variant="outlined" size="medium">
              Button
            </Button>
            <Button variant="outlined" size="large">
              Button
            </Button>
            <Button color="secondary" variant="outlined" size="small">
              Button
            </Button>
            <Button color="secondary" variant="outlined" size="medium">
              Button
            </Button>
            <Button color="secondary" variant="outlined" size="large">
              Button
            </Button>

            <Button disabled variant="outlined" size="small">
              Button
            </Button>
            <Button disabled variant="outlined" size="medium">
              Button
            </Button>
            <Button disabled variant="outlined" size="large">
              Button
            </Button>
          </Stack>

          <Stack spacing={1} direction="row" alignItems="center">
            <Button variant="contained" size="small">
              Button
            </Button>
            <Button variant="contained" size="medium">
              Button
            </Button>
            <Button variant="contained" size="large">
              Button
            </Button>
            <Button color="secondary" variant="contained" size="small">
              Button
            </Button>
            <Button color="secondary" variant="contained" size="medium">
              Button
            </Button>
            <Button color="secondary" variant="contained" size="large">
              Button
            </Button>

            <Button disabled variant="contained" size="small">
              Button
            </Button>
            <Button disabled variant="contained" size="medium">
              Button
            </Button>
            <Button disabled variant="contained" size="large">
              Button
            </Button>
          </Stack>

          <Stack spacing={1} direction="row" alignItems="center">
            <Chip size="small" label="Main" />
            <Chip size="medium" label="Main" />
            <Chip
              size="medium"
              label={
                <>
                  Main
                  <br />
                  Multiline
                </>
              }
            />
            <Chip size="small" variant="outlined" label="Main" />
            <Chip
              size="small"
              variant="outlined"
              label={
                <>
                  Main
                  <br />
                  Multiline
                </>
              }
            />
            <Chip size="medium" variant="outlined" label="Main" />
            <Chip
              size="medium"
              variant="outlined"
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
            <Chip color="primary" size="small" label="Main" />
            <Chip size="medium" color="primary" label="Main" />
            <Chip
              size="medium"
              color="primary"
              label={
                <>
                  Main
                  <br />
                  Multiline
                </>
              }
            />
            <Chip
              color="primary"
              size="small"
              variant="outlined"
              label="Main"
            />
            <Chip
              size="medium"
              color="primary"
              variant="outlined"
              label="Main"
            />
            <Chip
              size="medium"
              color="primary"
              variant="outlined"
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
            <Chip color="secondary" size="small" label="Main" />
            <Chip size="medium" color="secondary" label="Main" />
            <Chip
              size="medium"
              color="secondary"
              label={
                <>
                  Main
                  <br />
                  Multiline
                </>
              }
            />
            <Chip
              color="secondary"
              size="small"
              variant="outlined"
              label="Main"
            />
            <Chip
              size="medium"
              color="secondary"
              variant="outlined"
              label="Main"
            />
            <Chip
              size="medium"
              color="secondary"
              variant="outlined"
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

          <Stack spacing={1} direction="row" alignItems="center">
            <Switch size="medium" />
            <Switch size="medium" color="secondary" />
            <Switch size="medium" color="success" />
            <Switch size="small" />
            <Switch size="small" color="secondary" />
            <Switch size="small" color="success" />
          </Stack>
          <Stack spacing={1} direction="row" alignItems="center">
            <Switch size="medium" checked />
            <Switch size="medium" checked color="secondary" />
            <Switch size="medium" checked color="success" />
            <Switch size="small" checked />
            <Switch size="small" checked color="secondary" />
            <Switch size="small" checked color="success" />
          </Stack>
          <Stack spacing={1} direction="row" alignItems="center">
            <Switch size="medium" disabled />
            <Switch size="medium" disabled color="secondary" />
            <Switch size="medium" disabled color="success" />
            <Switch size="small" disabled />
            <Switch size="small" disabled color="secondary" />
            <Switch size="small" disabled color="success" />
          </Stack>
          <Stack spacing={1} direction="row" alignItems="center">
            <Switch size="medium" checked disabled />
            <Switch size="medium" checked disabled color="secondary" />
            <Switch size="medium" checked disabled color="success" />
            <Switch size="small" checked disabled />
            <Switch size="small" checked disabled color="secondary" />
            <Switch size="small" checked disabled color="success" />
          </Stack>
        </Stack>
      </Container>
    </Navigation>
  );
}
