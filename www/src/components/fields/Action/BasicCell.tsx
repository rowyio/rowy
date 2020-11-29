import React from "react";
import { IBasicCellProps } from "../types";

export default function BasicCell({ name, value }: IBasicCellProps) {
  return <>{value ? value.status : name}</>;
}
