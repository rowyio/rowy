import React from "react";
import Button from "@material-ui/core/Button";

const EmptyTable = (props: any) => {
  const { isLoading, tableHeight, addRow } = props;
  if (isLoading) return <h3>Fetching rows</h3>;
  else
    return (
      <div
        style={{
          height: tableHeight,
          textAlign: "center",
          backgroundColor: "#eee",
          padding: "100px",
        }}
      >
        <h3>no data to show</h3>
        <Button
          onClick={() => {
            addRow();
          }}
        >
          Add Row
        </Button>
      </div>
    );
};
export default EmptyTable;
