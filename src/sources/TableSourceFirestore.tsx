import { memo, useMemo, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { find } from "lodash-es";

import { globalScope, tablesAtom } from "@src/atoms/globalScope";
import {
  tableScope,
  tableIdAtom,
  tableSettingsAtom,
  tableSchemaAtom,
} from "@src/atoms/tableScope";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";

import useFirestoreDocWithAtom from "@src/hooks/useFirestoreDocWithAtom";

// import useFirestoreCollectionWithAtom from "@src/hooks/useFirestoreCollectionWithAtom";
// import {
//   globalScope,
//   allUsersAtom,
//   updateUserAtom,
// } from "@src/atoms/globalScope";
import { TABLE_SCHEMAS, TABLE_GROUP_SCHEMAS } from "@src/config/dbPaths";

const TableSourceFirestore = memo(function TableSourceFirestore() {
  const [tables] = useAtom(tablesAtom, globalScope);
  const [firebaseDb] = useAtom(firebaseDbAtom, globalScope);

  // Get tableSettings from tableId and tables in globalScope
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const setTableSettings = useSetAtom(tableSettingsAtom, tableScope);
  // Store tableSettings as local const so we don’t re-render
  // when tableSettingsAtom is set
  const tableSettings = useMemo(
    () => find(tables, ["id", tableId]),
    [tables, tableId]
  );
  // Store in tableSettingsAtom
  useEffect(() => {
    setTableSettings(tableSettings);
  }, [tableSettings, setTableSettings]);

  useFirestoreDocWithAtom(
    tableSchemaAtom,
    tableScope,
    tableSettings?.tableType === "collectionGroup"
      ? TABLE_GROUP_SCHEMAS
      : TABLE_SCHEMAS,
    { pathSegments: [tableId] }
  );

  return null;
});

export default TableSourceFirestore;
