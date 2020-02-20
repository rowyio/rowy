import React from "react";

import { useFiretableContext } from "contexts/firetableContext";

interface Props {
  value: any;
  row: { ref: firebase.firestore.DocumentReference; id: string };
  onSubmit: Function;
}

const LongText = (props: Props) => {
  const { setSideDrawerOpen } = useFiretableContext();
  const { value } = props;

  return (
    <div
      onDoubleClick={() => {
        if (setSideDrawerOpen) setSideDrawerOpen(true);
      }}
    >
      {JSON.stringify(value)}
    </div>
  );
};
export default LongText;
