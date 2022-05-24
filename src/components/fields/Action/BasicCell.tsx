import { IBasicCellProps } from "@src/components/fields/types";

export default function Action({ name, value }: IBasicCellProps) {
  return <>{value ? value.status : name}</>;
}
