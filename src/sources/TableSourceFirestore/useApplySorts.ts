import { useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";

import { projectScope, userSettingsAtom } from "@src/atoms/projectScope";
import {
  tableIdAtom,
  tableSchemaAtom,
  tableScope,
  tableSortsAtom,
} from "@src/atoms/tableScope";

/**
 * Sets the value of tableSortsAtom
 */
export default function useApplySorts() {
  // Apply the sorts

  const setTableSorts = useSetAtom(tableSortsAtom, tableScope);
  const [userSettings] = useAtom(userSettingsAtom, projectScope);
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);

  // Apply only once
  const [applySort, setApplySort] = useState(true);

  useEffect(() => {
    if (applySort && Object.keys(tableSchema).length) {
      console.log("useApplySorts");
      const userDefaultSort = userSettings.tables?.[tableId]?.sorts || [];
      console.log({
        userDefaultSort,
        tableSchemaSorts: tableSchema.sorts,
      });
      setTableSorts(
        userDefaultSort.length ? userDefaultSort : tableSchema.sorts || []
      );
      setApplySort(false);
    }
  }, [setTableSorts, userSettings, tableId, applySort, tableSchema]);
}
