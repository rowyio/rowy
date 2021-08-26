import { IBasicCellProps } from "../types";

export default function Action({ name, value }: IBasicCellProps) {
  return <>{value ? value.status : name}</>;
}
