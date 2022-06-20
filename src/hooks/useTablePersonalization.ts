import {
  globalScope,
  userSettingsAtom,
  updateUserSettingsAtom,
  TablePersonalization,
} from "@src/atoms/globalScope";
import { useAtom } from "jotai";
import { tableScope, tableIdAtom } from "@src/atoms/tableScope";
import { formatSubTableName } from "@src/utils/table";
const useTablePersonalization = (
  keyName: keyof TablePersonalization,
  fallback: any
) => {
  const [userSettings] = useAtom(userSettingsAtom, globalScope);
  const [updateUserSettings] = useAtom(updateUserSettingsAtom, globalScope);
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const handleUpdate = (value: Pick<TablePersonalization, typeof keyName>) => {
    if (updateUserSettings)
      updateUserSettings({
        tables: {
          [formatSubTableName(tableId)]: {
            [keyName]: value,
          },
        },
      });
  };
  const value =
    userSettings?.tables?.[formatSubTableName(tableId)]?.[keyName] ?? fallback;
  return [value, handleUpdate];
};
export default useTablePersonalization;
