import { IBasicCellProps } from "@src/components/fields/types";

export default function BasicCellValue({ value }: IBasicCellProps) {
  if (typeof value !== "string") return null;
  return <>{value}</>;
}
