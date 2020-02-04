import React from "react";

import { Grid, Switch } from "@material-ui/core";
import Confirmation from "../Confirmation";

// TODO: Create an interface for props
interface Props {
  value: boolean | null;
  //row: { ref: firebase.firestore.DocumentReference; id: string };
  row: any;
  column: { editable: Boolean; config: { confirmation?: any } };
  onSubmit: Function;
}

const CheckBox = (props: Props) => {
  const { value, row, onSubmit, column } = props;
  if (column.config.confirmation) {
    //<Confirmation message={{title:column.config.confirmation.title,body:column.config.confirmation.body.replace(/\{\{(.*)\}\}/,row.$1)}}> For Anindha

    return (
      <Confirmation
        message={{
          title: column.config.confirmation.title,
          body: column.config.confirmation.body.replace(
            "{{firstName}}",
            row.firstName
          ),
        }}
      >
        <Grid container justify="center">
          <Switch
            checked={!!value}
            onChange={() => onSubmit(!value)}
            disabled={!column.editable}
          />
        </Grid>
      </Confirmation>
    );
  } else {
    return (
      <Grid container justify="center">
        <Switch
          checked={!!value}
          onChange={() => onSubmit(!value)}
          disabled={!column.editable}
        />
      </Grid>
    );
  }
};

export default CheckBox;
