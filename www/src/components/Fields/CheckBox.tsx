import React from "react";

import Checkbox from "@material-ui/core/Checkbox";
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
        <Checkbox
          disabled={!column.editable}
          name={`checkBox-controlled-${row.id}`}
          checked={!!value}
          onChange={e => {
            onSubmit(!value);
          }}
        />
      </Confirmation>
    );
  } else {
    return (
      <Checkbox
        disabled={!column.editable}
        name={`checkBox-controlled-${row.id}`}
        checked={!!value}
        onChange={e => {
          onSubmit(!value);
        }}
      />
    );
  }
};

export default CheckBox;
