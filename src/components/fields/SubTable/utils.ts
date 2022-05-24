import { useLocation, useSearchParams } from "react-router-dom";

import { ROUTES } from "@src/constants/routes";
import { ColumnConfig, TableRow, TableRowRef } from "@src/types/table";

export const useSubTableData = (
  column: ColumnConfig,
  row: TableRow,
  docRef: TableRowRef
) => {
  const label = (column.config?.parentLabel ?? []).reduce((acc, curr) => {
    if (acc !== "") return `${acc} - ${row[curr]}`;
    else return row[curr];
  }, "");

  const fieldName = column.key;
  const documentCount: string = row[fieldName]?.count ?? "";

  const location = useLocation();
  const parentPath = decodeURIComponent(
    location.pathname.split("/").pop() ?? ""
  );

  const [searchParams] = useSearchParams();
  const parentLabels = searchParams.get("parentLabel");
  let subTablePath =
    ROUTES.table +
    "/" +
    encodeURIComponent(`${parentPath}/${docRef.id}/${fieldName}`) +
    "?parentLabel=";

  if (parentLabels) subTablePath += `${parentLabels ?? ""},${label ?? ""}`;
  else subTablePath += encodeURIComponent(label ?? "");

  return { documentCount, label, subTablePath };
};
