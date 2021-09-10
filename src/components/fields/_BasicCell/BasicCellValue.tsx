import { IBasicCellProps } from "../types";

export default function BasicCellValue({ value }: IBasicCellProps) {
  if (typeof value !== "string") return null;
  return <>{value}</>;
}
