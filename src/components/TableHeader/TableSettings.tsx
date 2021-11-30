import { useState } from "react";
import _find from "lodash/find";

import TableHeaderButton from "./TableHeaderButton";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";

import TableSettingsDialog, {
  TableSettingsDialogModes,
} from "@src/components/TableSettings";
import { useProjectContext } from "@src/contexts/ProjectContext";

export default function TableSettings() {
  const [open, setOpen] = useState(false);

  const { tableState, tables } = useProjectContext();
  const table = _find(tables, { id: tableState?.config.id });

  return (
    <>
      <TableHeaderButton
        title="Table settings"
        onClick={() => setOpen(true)}
        icon={<SettingsIcon />}
        disabled={!table}
      />

      {table && (
        <TableSettingsDialog
          clearDialog={() => setOpen(false)}
          mode={open ? TableSettingsDialogModes.update : null}
          data={open ? table : null}
        />
      )}
    </>
  );
}
