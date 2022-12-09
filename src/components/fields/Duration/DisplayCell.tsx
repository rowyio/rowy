import { IDisplayCellProps } from "@src/components/fields/types";

import { getDurationString } from "./utils";

export default function Duration({ value }: IDisplayCellProps) {
  if (
    !value ||
    !value.start ||
    !("toDate" in value.start) ||
    !value.end ||
    !("toDate" in value.end)
  )
    return null;

  return <>{getDurationString(value.start.toDate(), value.end.toDate())}</>;
}
