import { IDisplayCellProps } from "@src/components/fields/types";
import { get } from "lodash-es";

export const getActionName = (column: IDisplayCellProps["column"]) => {
  const config = get(column, "config");
  if (!get(config, "customName.enabled")) {
    return get(column, "name");
  }
  return get(config, "customName.actionName") || get(column, "name");
};

export default function Action({ value, column }: IDisplayCellProps) {
  return <>{value ? value.status : getActionName(column)}</>;
}
