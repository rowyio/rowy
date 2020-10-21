import React, { useState } from "react";

import { Tooltip, Button } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";

import TableSettingsDialog, {
  TableSettingsDialogModes,
} from "components/TableSettings";
import { useFiretableContext } from "contexts/firetableContext";

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
        data={
          open
            ? ({
                collection: tableState?.config.tableConfig.doc.collection,
                description: tableState?.config.tableConfig.doc.description,
                roles: tableState?.config.tableConfig.doc.roles,
                name: tableState?.config.tableConfig.doc.name,
                section: tableState?.config.tableConfig.doc.section,
                // isCollectionGroup: !"string",
                // tableType: "string",
              } as any)
            : null
        }
      />
    </>
  );
}
