import { useContext, useEffect } from "react";
import { SnackContext } from "contexts/SnackContext";

import Navigation from "components/Navigation";
import {
  Container,
  Stack,
  Grid,
  Button,
  Chip,
  Paper,
  MenuList,
  MenuItem,
  Slider,
  Tooltip,
  Switch,
  TextField,
} from "@material-ui/core";

export default function TestView() {
  const snackContext = useContext(SnackContext);

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
            />
          </Tooltip>

          <Slider
            valueLabelDisplay="on"
            // valueLabelFormat={(v) => `${v} label`}
            marks={[
              { value: 20, label: 20 },
              { value: 40, label: 40 },
            ]}
            disabled
            defaultValue={30}
          />

          <Stack spacing={1} direction="row">
            <Switch size="medium" />
            <Switch size="medium" color="secondary" />
            <Switch size="medium" color="success" />
            <Switch size="medium" disabled />
            <Switch size="small" />
            <Switch size="small" color="secondary" />
            <Switch size="small" color="success" />
            <Switch size="small" disabled />
          </Stack>
          <Stack spacing={1} direction="row">
            <Switch size="medium" checked />
            <Switch size="medium" checked color="secondary" />
            <Switch size="medium" checked color="success" />
            <Switch size="medium" checked disabled />
            <Switch size="small" checked />
            <Switch size="small" checked color="secondary" />
            <Switch size="small" checked color="success" />
            <Switch size="small" checked disabled />
          </Stack>
        </Stack>
      </Container>
    </Navigation>
  );
}
