import queryString from "query-string";
import { useLocation } from "react-router-dom";

export const useSubTableData = (
  column: any,
  row: any,
  docRef: firebase.default.firestore.DocumentReference
) => {
  const { parentLabel, config } = column as any;
  const label: string = parentLabel
    ? row[parentLabel]
    : config.parentLabel
    ? config.parentLabel.reduce((acc, curr) => {
        if (acc !== "") return `${acc} - ${row[curr]}`;
        else return row[curr];
      }, "")
    : "";
  const fieldName = column.key;
  const documentCount: string = row[fieldName]?.count ?? "";

  const location = useLocation();
  const parentLabels = queryString.parse(location.search).parentLabel;
  const parentPath = decodeURIComponent(
    location.pathname.split("/").pop() ?? ""
  );

  let subTablePath = "";
  if (parentLabels)
    subTablePath =
      encodeURIComponent(`${parentPath}/${docRef.id}/${fieldName}`) +
      `?parentLabel=${parentLabels ?? ""},${label ?? ""}`;
  else
    subTablePath =
      encodeURIComponent(`${parentPath}/${docRef.id}/${fieldName}`) +
      `?parentLabel=${encodeURIComponent(label ?? "")}`;

  return { documentCount, label, subTablePath };
};
