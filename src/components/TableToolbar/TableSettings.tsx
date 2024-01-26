import { useAtom, useSetAtom } from "jotai";

import TableToolbarButton from "./TableToolbarButton";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";

import { projectScope, tableSettingsDialogAtom } from "@src/atoms/projectScope";
import { tableScope, tableSettingsAtom } from "@src/atoms/tableScope";
import TableSettingsActionRegister from "./KbarActions/TableSettingsActionRegister";


export default function TableSettings() {
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const openTableSettingsDialog = useSetAtom(
    tableSettingsDialogAtom,
    projectScope
  );

  return (
    <>
      {!(!openTableSettingsDialog || tableSettings.id.includes("/")) ? (
        <TableSettingsActionRegister />
      ) : (
        ""
      )}
      <TableToolbarButton
        title="Table settings"
        onClick={() =>
          openTableSettingsDialog({ mode: "update", data: tableSettings })
        }
        icon={<SettingsIcon />}
        disabled={!openTableSettingsDialog || tableSettings.id.includes("/")}
      />
    </>
  );
}
