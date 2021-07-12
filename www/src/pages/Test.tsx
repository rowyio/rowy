import { useContext, useEffect } from "react";
import { SnackContext } from "contexts/SnackContext";

import { Container, Stack, Grid, Chip, Paper, Slider } from "@material-ui/core";

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
    <Container style={{ margin: "24px 0 200px" }}>
      <Stack spacing={8}>
        <Stack spacing={1} direction="row" alignItems="center">
          <Chip size="small" label="Main" />
          <Chip label="Main" />
          <Chip
            label={
              <>
                Main
                <br />
                Multiline
              </>
            }
          />
          <Chip size="small" variant="outlined" label="Main" />
          <Chip variant="outlined" label="Main" />
          <Chip
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
          <Chip color="primary" label="Main" />
          <Chip
            color="primary"
            label={
              <>
                Main
                <br />
                Multiline
              </>
            }
          />
          <Chip color="primary" size="small" variant="outlined" label="Main" />
          <Chip color="primary" variant="outlined" label="Main" />
          <Chip
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
          <Chip color="secondary" label="Main" />
          <Chip
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
          <Chip color="secondary" variant="outlined" label="Main" />
          <Chip
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

        <Slider
          valueLabelDisplay="on"
          // valueLabelFormat={(v) => `${v} label`}
          marks={[
            { value: 20, label: 20 },
            { value: 40, label: 40 },
          ]}
        />
      </Stack>
    </Container>
  );
}
