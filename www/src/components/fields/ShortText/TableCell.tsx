import React from "react";
import { ICustomCellProps } from "../types";

export default function ShortText({ value }: ICustomCellProps) {
  return <>{`${value}`}</>;
}
