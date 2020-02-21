import React from "react";
import withCustomCell, { CustomCellProps } from "./withCustomCell";

function Json({ value }: CustomCellProps) {
  if (!value) return null;
  return <span>{JSON.stringify(value)}</span>;
}

export default withCustomCell(Json);
