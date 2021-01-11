import React, { useState } from "react";

import { Tooltip, Button } from "@material-ui/core";
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
      <Tooltip title="Table Settings">
        <Button
          variant="contained"
          color="secondary"
          style={{ minWidth: 32, padding: 0 }}
          aria-label="Table Settings"
          onClick={() => setOpen(true)}
        >
          <SettingsIcon />
        </Button>
      </Tooltip>

      <TableSettingsDialog
        clearDialog={() => setOpen(false)}
        mode={open ? TableSettingsDialogModes.update : null}
        data={open ? tableState?.config.tableConfig.doc : null}
      />
    </>
  );
}
