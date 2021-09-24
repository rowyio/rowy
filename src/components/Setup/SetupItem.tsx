import { Stack, CircularProgress, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ArrowIcon from "@mui/icons-material/ArrowForward";

export interface ISetupItemProps {
  status: "complete" | "loading" | "incomplete";
  title: React.ReactNode;
  children?: React.ReactNode;
}

export default function SetupItem({
  status,
  title,
  children,
}: ISetupItemProps) {
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="flex-start"
      aria-busy={status === "loading"}
      aria-describedby={status === "loading" ? "progress" : undefined}
      style={{ width: "100%" }}
    >
      {status === "complete" ? (
        <CheckIcon aria-label="Item complete" color="action" />
      ) : status === "loading" ? (
        <CircularProgress
          id="progress"
          size={20}
          thickness={5}
          sx={{ m: 0.25 }}
        />
      ) : (
        <ArrowIcon aria-label="Item" color="primary" />
      )}

      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="inherit">{title}</Typography>

        {children}
      </Stack>
    </Stack>
  );
}
