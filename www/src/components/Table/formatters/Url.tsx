import React from "react";
import withCustomCell, { CustomCellProps } from "./withCustomCell";

function Url({ value }: CustomCellProps) {
  return (
    <a href={value} target="_blank" rel="noopener noreferrer">
      {value}
    </a>
  );
}

export default withCustomCell(Url);
