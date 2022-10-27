import { useState } from "react";
import { useAtom, useSetAtom } from "jotai";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { ChevronDown } from "@src/assets/icons";
import MultiSelect from "@rowy/multiselect";

import {
  compatibleRowyRunVersionAtom,
  projectScope,
  rowyRunModalAtom,
} from "@src/atoms/projectScope";

import { IRuntimeOptions } from "./utils";

export default function RuntimeOptions({
  runtimeOptions,
  handleUpdate,
  errors,
}: {
  runtimeOptions: IRuntimeOptions;
  handleUpdate: (runtimeOptions: IRuntimeOptions) => void;
  errors: { timeoutSeconds: boolean };
}) {
  const [compatibleRowyRunVersion] = useAtom(
    compatibleRowyRunVersionAtom,
    projectScope
  );
  const openRowyRunModal = useSetAtom(rowyRunModalAtom, projectScope);

  const [expanded, setExpanded] = useState(false);

  const isCompatibleRowyRun = compatibleRowyRunVersion({ minVersion: "1.6.4" });

  return (
    <Accordion
      sx={{
        padding: 0,
        boxShadow: "none",
        backgroundImage: "inherit",
        backgroundColor: "inherit",
      }}
      expanded={isCompatibleRowyRun && expanded}
    >
      <AccordionSummary
        sx={{ padding: 0 }}
        expandIcon={
          isCompatibleRowyRun ? (
            <ChevronDown />
          ) : (
            <Button>Update Rowy Run</Button>
          )
        }
        onClick={() =>
          isCompatibleRowyRun
            ? setExpanded(!expanded)
            : openRowyRunModal({
                version: "1.6.4",
                feature: "Runtime options",
              })
        }
      >
        <Typography variant="subtitle1">Runtime options</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <MultiSelect
              label="Memory Allocated"
              value={runtimeOptions.memory ?? "256MB"}
              onChange={(value) => handleUpdate({ memory: value ?? "256MB" })}
              multiple={false}
              options={["128MB", "256MB", "512MB", "1GB", "2GB", "4GB", "8GB"]}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              value={runtimeOptions.timeoutSeconds ?? 60}
              label="Timeout"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">seconds</InputAdornment>
                ),
              }}
              onChange={(e) =>
                !isNaN(Number(e.target.value)) &&
                handleUpdate({
                  timeoutSeconds: Number(e.target.value),
                })
              }
              inputProps={{
                inputMode: "numeric",
              }}
              error={errors.timeoutSeconds}
              helperText={
                errors.timeoutSeconds
                  ? "Timeout must be an integer between 1 and 540"
                  : "The maximum timeout that can be specified is 9 mins (540 seconds)"
              }
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
