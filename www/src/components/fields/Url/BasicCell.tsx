import { IBasicCellProps } from "../types";

import { Link } from "@material-ui/core";

export default function Url({ value }: IBasicCellProps) {
  if (!value) return null;

  const href = value.includes("http") ? value : `https://${value}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      underline="always"
      style={{ fontWeight: "bold" }}
    >
      {value}
    </Link>
  );
}
