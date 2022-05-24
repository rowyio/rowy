import { IHeavyCellProps } from "@src/components/fields/types";
import { useSetAtom } from "jotai";
import { get } from "lodash-es";

import { FormControlLabel, Switch } from "@mui/material";
import { globalScope, confirmDialogAtom } from "@src/atoms/globalScope";

const replacer = (data: any) => (m: string, key: string) => {
  const objKey = key.split(":")[0];
  const defaultValue = key.split(":")[1] || "";
  return get(data, objKey, defaultValue);
};

export default function Checkbox({
  row,
  column,
  value,
  onSubmit,
  disabled,
}: IHeavyCellProps) {
  const confirm = useSetAtom(confirmDialogAtom, globalScope);

  const handleChange = () => {
    if (column?.config?.confirmation) {
      confirm({
        title: column.config.confirmation.title,
        body: column.config.confirmation.body.replace(
          /\{\{(.*?)\}\}/g,
          replacer(row)
        ),
        handleConfirm: () => onSubmit(!value),
      });
    } else {
      onSubmit(!value);
    }
  };

  return (
    <FormControlLabel
      control={
        <Switch
          checked={!!value}
          onChange={handleChange}
          disabled={disabled}
          color="success"
        />
      }
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
