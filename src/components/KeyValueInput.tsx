import { useState } from "react";

import {
  FormControl,
  FormLabel,
  FormGroup,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/DeleteOutline";

export interface IKeyValueInputProps {
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  label?: React.ReactNode;
}

export default function KeyValueInput({
  value: valueProp,
  onChange,
  label,
}: IKeyValueInputProps) {
  const [value, setValue] = useState(
    Object.keys(valueProp).length > 0
      ? Object.keys(valueProp)
          .sort()
          .map((key) => [key, valueProp[key]])
      : [["", ""]]
  );

  const saveValue = (v: typeof value) => {
    onChange(
      v.reduce((acc, [key, value]) => {
        if (key.length > 0) acc[key] = value;
        return acc;
      }, {} as Record<string, string>)
    );
  };

  const handleAdd = (i: number) => () =>
    setValue((v) => {
      const newValue = [...v];
      newValue.splice(i + 1, 0, ["", ""]);
      setTimeout(() =>
        document.getElementById(`keyValue-${i + 1}-key`)?.focus()
      );
      return newValue;
    });
  const handleRemove = (i: number) => () =>
    setValue((v) => {
      const newValue = [...v];
      newValue.splice(i, 1);
      saveValue(newValue);
      return newValue;
    });

  const handleChange =
    (i: number, j: number) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue((v) => {
        const newValue = [...v];
        newValue[i][j] = e.target.value;
        saveValue(newValue);
        return newValue;
      });

  return (
    <FormControl variant="filled" style={{ alignItems: "flex-start" }}>
      <FormLabel
        component="legend"
        sx={{ typography: "button", color: "text.primary", mb: 0.25, ml: 0.25 }}
      >
        {label}
      </FormLabel>

      <FormGroup>
        {value.map(([propKey, propValue], i) => (
          <Stack
            key={i}
            direction="row"
            alignItems="flex-start"
            sx={{ "& + &": { mt: 1 } }}
          >
            <TextField
              id={`keyValue-${i}-key`}
              aria-label="Key"
              placeholder="Key"
              value={propKey}
              sx={{
                "& .MuiInputBase-root": {
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                },
              }}
              onChange={handleChange(i, 0)}
              error={propKey.length === 0}
              helperText={propKey.length === 0 ? "Required" : ""}
            />

            <TextField
              id={`keyValue-${i}-value`}
              aria-label="Value"
              placeholder="Value"
              value={propValue}
              sx={{
                ml: "-1px",
                "& .MuiInputBase-root": {
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                },
              }}
              onChange={handleChange(i, 1)}
            />

            <Button
              onClick={handleRemove(i)}
              aria-label="Remove row"
              sx={{ ml: 1, px: "0 !important", minWidth: 32 }}
              color="error"
            >
              <RemoveIcon />
            </Button>
          </Stack>
        ))}
      </FormGroup>

      <Button
        onClick={handleAdd(value.length - 1)}
        color="primary"
        startIcon={<AddIcon />}
        sx={{ mt: 1 }}
      >
        Add row
      </Button>
    </FormControl>
  );
}
