import { useAtom, useSetAtom } from "jotai";

import TableHeaderButton from "./TableHeaderButton";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";

import { globalScope, tableSettingsDialogAtom } from "@src/atoms/globalScope";
import { tableScope, tableSettingsAtom } from "@src/atoms/tableScope";

export default function TableSettings() {
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const openTableSettingsDialog = useSetAtom(
    tableSettingsDialogAtom,
    globalScope
  );

  return (
    <TableHeaderButton
      title="Table settings"
      onClick={() =>
        openTableSettingsDialog({ mode: "update", data: tableSettings })
      }
      icon={<SettingsIcon />}
      disabled={!openTableSettingsDialog}
    />
  );
}
