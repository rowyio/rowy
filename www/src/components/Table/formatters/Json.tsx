import React from "react";
import { CustomCellProps } from "./withCustomCell";

export default function Json({ value }: CustomCellProps) {
  if (!value) return null;
  return <span>{JSON.stringify(value)}</span>;
}
