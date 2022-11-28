import { IDisplayCellProps } from "@src/components/fields/types";

export default function Number_({ value }: IDisplayCellProps) {
  return <>{`${value ?? ""}`}</>;
}
