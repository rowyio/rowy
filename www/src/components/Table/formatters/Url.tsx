import React from "react";
import { CustomCellProps } from "./withCustomCell";

export default function Url({ value }: CustomCellProps) {
  return (
    <a href={value} target="_blank" rel="noopener noreferrer">
      {value}
    </a>
  );
}
