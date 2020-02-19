import React from "react";
import Button from "@material-ui/core/Button";
import Loading from "../Loading";
import EmptyState from "../EmptyState";
import { useFiretableContext } from "../../contexts/firetableContext";
const EmptyTable = (props: any) => {
  const { isLoading, tableHeight } = props;
  const { tableActions } = useFiretableContext();
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
            tableActions?.row.add();
          }}
        >
          Add Row
        </Button>
      </div>
    );
};
export default EmptyTable;
