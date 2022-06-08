import { TextField } from "@mui/material";

export interface IIdFilterInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function IdFilterInput({
  value,
  onChange,
}: IIdFilterInputProps) {
  return (
    <TextField
      aria-label="Filter by this ID"
      onChange={(e) => onChange(e.target.value)}
      value={value}
      fullWidth
      sx={{
        "& .MuiFilledInput-input": {
          typography: "caption",
          fontFamily: "mono",
        },
      }}
    />
  );
}
