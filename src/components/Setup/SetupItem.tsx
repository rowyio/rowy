import { Stack, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ArrowIcon from "@mui/icons-material/ArrowForward";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

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
        <CircularProgressOptical id="progress" size={20} sx={{ m: 0.25 }} />
      ) : (
        <ArrowIcon aria-label="Item" color="primary" />
      )}

      <Stack
        spacing={2}
        alignItems="flex-start"
        style={{ flexGrow: 1, minWidth: 0 }}
      >
        <Typography
          variant="inherit"
          sx={{ "& .MuiButton-root": { mt: -0.5 } }}
        >
          {title}
        </Typography>

        {children}
      </Stack>
    </Stack>
  );
}
