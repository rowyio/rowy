import { IBasicCellProps } from "@src/components/fields/types";

export default function Number_({ value }: IBasicCellProps) {
  return <>{`${value?.path ?? ""}`}</>;
}
