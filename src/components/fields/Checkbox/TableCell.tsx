import { IHeavyCellProps } from "../types";
import _get from "lodash/get";

import { FormControlLabel, Switch } from "@mui/material";
import Confirmation from "@src/components/Confirmation";

const replacer = (data: any) => (m: string, key: string) => {
  const objKey = key.split(":")[0];
  const defaultValue = key.split(":")[1] || "";
  return _get(data, objKey, defaultValue);
};

export default function Checkbox({
  row,
  column,
  value,
  onSubmit,
  disabled,
}: IHeavyCellProps) {
  let component = (
    <Switch
      checked={!!value}
      onChange={() => onSubmit(!value)}
      disabled={disabled}
      color="success"
    />
  );

  if (column?.config?.confirmation)
    component = (
      <Confirmation
        message={{
          title: column.config.confirmation.title,
          body: column.config.confirmation.body.replace(
            /\{\{(.*?)\}\}/g,
            replacer(row)
          ),
        }}
        functionName="onChange"
      >
        {component}
      </Confirmation>
    );

  return (
    <FormControlLabel
      control={component}
      label={column.name as string}
      labelPlacement="start"
      sx={{
        m: 0,
        width: "100%",
        alignItems: "center",

        "& .MuiFormControlLabel-label": {
          font: "inherit",
          letterSpacing: "inherit",
          flexGrow: 1,
          overflowX: "hidden",
          mt: "0 !important",
        },

        "& .MuiSwitch-root": { mr: -0.75 },
      }}
    />
  );
}
