import React from "react";
import Button from "@material-ui/core/Button";
import Loading from "../Loading";
import EmptyState from "../EmptyState";

const EmptyTable = (props: any) => {
  const { isLoading, tableHeight, addRow } = props;
  if (isLoading) return <Loading message="Fetching rows" />;
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
        <EmptyState message="No data to show" />
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
