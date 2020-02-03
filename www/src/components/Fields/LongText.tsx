import React, { useContext } from "react";

import EditorContext from "contexts/editorContext";
import { FieldType } from "constants/fields";

interface Props {
  value: any;
  row: { ref: firebase.firestore.DocumentReference; id: string };
  onSubmit: Function;
}

const LongText = (props: Props) => {
  const editorContext = useContext(EditorContext);
  const { value } = props;

  return (
    <div
      onDoubleClick={() => {
        editorContext.open(props, FieldType.longText);
      }}
    >
      {value}
    </div>
  );
};
export default LongText;
