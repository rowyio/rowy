import { useState, useEffect } from "react";

import { darken, lighten } from "@mui/system";
import { alpha, Fade, Paper, Chip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

export type SaveStates = "" | "unsaved" | "saving" | "saved";
export interface ISaveStateProps {
  state: SaveStates;
}

export default function SaveState({ state }: ISaveStateProps) {
  const [showHelpMessage, setShowHelpMessage] = useState(false);
  useEffect(() => {
    if (state !== "unsaved") {
      setShowHelpMessage(false);
      return;
    }

    const timeout = setTimeout(() => setShowHelpMessage(true), 3000);
    return () => {
      setShowHelpMessage(false);
      clearTimeout(timeout);
    };
  }, [state]);

  return (
    <Fade in={Boolean(state)}>
      <Paper
        elevation={6}
        sx={[
          {
            position: "sticky",
            mt: -3,
            mb: -3,
            top: (theme) => theme.spacing(-3),
            right: (theme) => theme.spacing(-0.75),
            alignSelf: "flex-end",

            zIndex: "drawer",
            borderRadius: 100,
            width: "min-content",
            boxShadow: 1,
          },
          {
            "& .MuiChip-root": { display: "flex", minWidth: 75 },
            "& .MuiChip-icon": { color: "inherit" },
          },
        ]}
      >
        {state === "unsaved" ? (
          <Chip
            label={
              "You have unsaved changes" +
              (showHelpMessage ? ". Click anywhere to save." : "")
            }
            sx={{
              bgcolor: (theme) => alpha(theme.palette.warning.light, 0.15),
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? lighten(theme.palette.warning.main, 0.6)
                  : darken(theme.palette.warning.main, 0.6),
              transitionDuration: 0,
            }}
          />
        ) : state === "saving" ? (
          <Chip label="Saving…" />
        ) : (
          <Chip label="Saved" icon={<CheckIcon />} />
        )}
      </Paper>
    </Fade>
  );
}
