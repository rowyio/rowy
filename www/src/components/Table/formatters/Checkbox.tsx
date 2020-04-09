import React from "react";
import { CustomCellProps } from "./withCustomCell";
import _get from "lodash/get";
import {
  makeStyles,
  createStyles,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import Confirmation from "components/Confirmation";

const useStyles = makeStyles(theme =>
  createStyles({
    root: { paddingLeft: theme.spacing(1.5) },

    label: {
      font: "inherit",

      flexGrow: 1,
      width: "calc(100% - 58px)",
      overflowX: "hidden",
    },

    switchBase: {
      "&$switchChecked": { color: green["A700"] },
      "&$switchChecked + $switchTrack": { backgroundColor: green["A700"] },
    },
    switchChecked: {},
    switchTrack: {},
  })
);

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
}: CustomCellProps) {
  const classes = useStyles();
  let component = (
    <Switch
      checked={!!value}
      onChange={() => onSubmit(!value)}
      disabled={!column.editable}
      classes={{
        switchBase: classes.switchBase,
        checked: classes.switchChecked,
        track: classes.switchTrack,
      }}
    />
  );

  if ((column as any)?.config?.confirmation)
    component = (
      <Confirmation
        message={{
          title: (column as any).config.confirmation.title,
          body: (column as any).config.confirmation.body.replace(
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
      label={column.name}
      labelPlacement="start"
      className="cell-collapse-padding"
      classes={classes}
    />
  );
}
