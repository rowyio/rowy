import { useState } from "react";

import TableHeaderButton from "./TableHeaderButton";
import SettingsIcon from "@material-ui/icons/SettingsOutlined";

import TableSettingsDialog, {
  TableSettingsDialogModes,
} from "components/TableSettings";
import { useProjectContext } from "contexts/ProjectContext";

export default function TableSettings() {
  const [open, setOpen] = useState(false);

  const { tableState } = useProjectContext();

  return (
    <>
      <TableHeaderButton
        title="Table Settings"
        onClick={() => setOpen(true)}
        icon={<SettingsIcon />}
      />

      <TableSettingsDialog
        clearDialog={() => setOpen(false)}
        mode={open ? TableSettingsDialogModes.update : null}
        data={open ? tableState?.config.tableConfig.doc : null}
      />
    </>
  );
}
