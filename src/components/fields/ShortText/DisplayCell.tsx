import { IDisplayCellProps } from "@src/components/fields/types";

export default function DisplayCellValue({ value }: IDisplayCellProps) {
  if (typeof value !== "string") return null;
  return <>{value}</>;
}
