import React from "react";
import { ICustomCellProps } from "../types";

export default function Number_({ value }: ICustomCellProps) {
  return <>{`${value ?? ""}`}</>;
}
