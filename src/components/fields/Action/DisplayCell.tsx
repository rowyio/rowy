import { IDisplayCellProps } from "@src/components/fields/types";

export default function Action({ name, value }: IDisplayCellProps) {
  return <>{value ? value.status : name}</>;
}
