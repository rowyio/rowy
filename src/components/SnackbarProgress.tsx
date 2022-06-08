import { useState, Dispatch, SetStateAction, MutableRefObject } from "react";

import { Stack } from "@mui/material";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

export interface ISnackbarProgressRef {
  setProgress: Dispatch<SetStateAction<number>>;
  setTarget: Dispatch<SetStateAction<number>>;
}

export interface ISnackbarProgressProps {
  target?: number;
  stateRef: MutableRefObject<ISnackbarProgressRef | undefined>;
  label?: React.ReactNode;
}

export default function SnackbarProgress({
  target: targetProp = 100,
  stateRef,
  label,
}: ISnackbarProgressProps) {
  const [progress, setProgress] = useState(0);
  const [target, setTarget] = useState(targetProp);

  stateRef.current = { setProgress, setTarget };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ mr: 0.5, fontVariantNumeric: "tabular-nums" }}
    >
      <span>
        {progress}/{target}
        {label}
      </span>

      <div style={{ position: "relative", width: 24, height: 24 }}>
        <CircularProgressOptical
          value={(progress / target) * 100}
          variant="determinate"
          size={24}
          color="inherit"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <CircularProgressOptical
          disableShrink
          size={24}
          color="inherit"
          style={{ position: "absolute", top: 0, left: 0 }}
          sx={{ color: "primary.contrastText", opacity: 0.33 }}
        />
      </div>
    </Stack>
  );
}
