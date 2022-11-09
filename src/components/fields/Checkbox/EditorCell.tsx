import { IEditorCellProps } from "@src/components/fields/types";
import { useSetAtom } from "jotai";
import { get } from "lodash-es";

import { FormControlLabel, Switch } from "@mui/material";
import { projectScope, confirmDialogAtom } from "@src/atoms/projectScope";

const replacer = (data: any) => (m: string, key: string) => {
  const objKey = key.split(":")[0];
  const defaultValue = key.split(":")[1] || "";
  return get(data, objKey, defaultValue);
};

export default function Checkbox({
  row,
  column,
  value,
  onChange,
  onSubmit,
  disabled,
  tabIndex,
}: IEditorCellProps) {
  const confirm = useSetAtom(confirmDialogAtom, projectScope);

  const handleChange = () => {
    if (column?.config?.confirmation) {
      confirm({
        title: column.config.confirmation.title,
        body: column.config.confirmation.body.replace(
          /\{\{(.*?)\}\}/g,
          replacer(row)
        ),
        handleConfirm: () => {
          onChange(!value);
          onSubmit();
        },
      });
    } else {
      onChange(!value);
      onSubmit();
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
          tabIndex={tabIndex}
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
