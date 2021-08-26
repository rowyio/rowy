import queryString from "query-string";
import useRouter from "hooks/useRouter";

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
  const fieldName = column.key as string;
  const documentCount: string = row[fieldName]?.count ?? "";

  const router = useRouter();
  const parentLabels = queryString.parse(router.location.search).parentLabel;

  let subTablePath = "";
  if (parentLabels)
    subTablePath =
      encodeURIComponent(`${docRef.path}/${fieldName}`) +
      `?parentLabel=${parentLabels},${label}`;
  else
    subTablePath =
      encodeURIComponent(`${docRef.path}/${fieldName}`) +
      `?parentLabel=${encodeURIComponent(label)}`;

  return { documentCount, label, subTablePath };
};
