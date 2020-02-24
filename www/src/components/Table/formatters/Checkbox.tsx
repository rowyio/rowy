import React from "react";
import withCustomCell, { CustomCellProps } from "./withCustomCell";

import { Grid, Switch } from "@material-ui/core";
import Confirmation from "components/Confirmation";

function Checkbox({ row, column, value, onSubmit }: CustomCellProps) {
  const checkbox = (
    <Switch
      checked={!!value}
      onChange={() => onSubmit(!value)}
      disabled={!column.editable}
      color="primary"
    />
  );

  if ((column as any)?.config?.confirmation)
    return (
      <Grid container justify="center">
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
          {checkbox}
        </Confirmation>
      </Grid>
    );

  return (
    <Grid container justify="center">
      {checkbox}
    </Grid>
  );
}

export default withCustomCell(Checkbox);
