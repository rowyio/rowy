import React from "react";
import withCustomCell, { CustomCellProps } from "./withCustomCell";

import {
  makeStyles,
  createStyles,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
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
  })
);

function Checkbox({ row, column, value, onSubmit }: CustomCellProps) {
  const classes = useStyles();

  let component = (
    <Switch
      checked={!!value}
      onChange={() => onSubmit(!value)}
      disabled={!column.editable}
      color="primary"
    />
  );

  if ((column as any)?.config?.confirmation)
    component = (
      <Confirmation
        message={{
          title: (column as any).config.confirmation.title,
          body: (column as any).config.confirmation.body.replace(
            "{{firstName}}",
            row.firstName
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

export default withCustomCell(Checkbox);
