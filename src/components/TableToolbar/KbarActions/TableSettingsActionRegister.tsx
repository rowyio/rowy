import { useAtom, useSetAtom } from "jotai";
import { useRegisterActions } from "kbar";
import { projectScope, tableSettingsDialogAtom } from "@src/atoms/projectScope";
import { tableScope, tableSettingsAtom } from "@src/atoms/tableScope";

const TableSettingsActionRegister = () => {
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const openTableSettingsDialog = useSetAtom(
    tableSettingsDialogAtom,
    projectScope
  );

  useRegisterActions([
    {
      id: "tableSettings",
      name: "Table Settings",
      shortcut: ["x", "s"],
      keywords: "open table settings",
      perform: () => {
        openTableSettingsDialog({ mode: "update", data: tableSettings });
      },
    },
  ]);
  return null;
};

export default TableSettingsActionRegister;
