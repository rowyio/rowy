import { IBasicCellProps } from "../types";

export default function Number_({ value }: IBasicCellProps) {
  return <>{`${value ?? ""}`}</>;
}
