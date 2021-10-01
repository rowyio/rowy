import { IFiltersProps, IFilterOperator } from "../types";

import { TextField } from "@mui/material";

export default function ShortText({ handleChange, key }: IFiltersProps) {
  return (
    <TextField
      label="Value"
      id={key}
      onChange={(e) => {
        const value = e.target.value;
        handleChange(value);
      }}
      placeholder="Text value"
    />
  );
}

export const filterOperators: IFilterOperator[] = [
  {
    label: "equals",
    value: "==",
  },
  {
    label: "not equals",
    value: "!=",
  },
];
