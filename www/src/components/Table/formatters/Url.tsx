import React from "react";
import { CustomCellProps } from "./withCustomCell";

import { Link } from "@material-ui/core";

export default function Url({ value }: CustomCellProps) {
  return (
    <Link
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      underline="always"
      style={{ fontWeight: "bold" }}
    >
      {value}
    </Link>
  );
}
