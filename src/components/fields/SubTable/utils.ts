import { useLocation } from "react-router-dom";

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

  const documentCount: string = row[column.fieldName]?.count ?? "";

  const location = useLocation();
  const rootTablePath = decodeURIComponent(
    location.pathname.split("/" + ROUTES.subTable)[0]
  );

  // Get params from URL: /table/:tableId/subTable/:docPath/:subTableKey
  let subTablePath = [
    rootTablePath,
    ROUTES.subTable,
    encodeURIComponent(docRef.path),
    column.key,
  ].join("/");

  subTablePath += "?parentLabel=" + encodeURIComponent(label ?? "");

  return { documentCount, label, subTablePath };
};
