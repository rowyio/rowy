import { useState } from "react";

import TableHeaderButton from "./TableHeaderButton";
import SettingsIcon from "@material-ui/icons/Settings";

import TableSettingsDialog, {
  TableSettingsDialogModes,
} from "components/TableSettings";
import { useFiretableContext } from "contexts/FiretableContext";

export default function TableSettings() {
  const [open, setOpen] = useState(false);

  const { tableState } = useFiretableContext();

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
