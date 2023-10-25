import { useState, Suspense } from "react";
import { Control } from "react-hook-form";
import { useSetAtom } from "jotai";
import type { UseFormReturn, FieldValues } from "react-hook-form";

import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { Export as ExportIcon, Import as ImportIcon } from "@src/assets/icons";

import ImportSettings from "./ImportSettings";
import ExportSettings from "./ExportSettings";

import {
  projectScope,
  tableSettingsDialogIdAtom,
  TableSettingsDialogState,
} from "@src/atoms/projectScope";

export interface IActionsMenuProps {
  mode: TableSettingsDialogState["mode"];
  control: Control;
  useFormMethods: UseFormReturn<FieldValues, object>;
}

export default function ActionsMenu({
  mode,
  control,
  useFormMethods,
}: IActionsMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const setTableSettingsDialogId = useSetAtom(
    tableSettingsDialogIdAtom,
    projectScope
  );

  // On open, set tableSettingsDialogIdAtom so the derived
  // tableSettingsDialogSchemaAtom can fetch the schema doc
  const handleOpen: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setAnchorEl(e.currentTarget);
    const tableId = useFormMethods.getValues("id") as string;
    setTableSettingsDialogId(tableId);
  };
  // Reset the tableSettingsDialogIdAtom so we fetch fresh data every time
  // the menu is opened
  const handleClose = () => {
    setAnchorEl(null);
    setTableSettingsDialogId("");
  };

  return (
    <>
      <Tooltip title="Actions menu">
        <IconButton
          aria-label="Actions…"
          id="table-settings-actions-button"
          aria-controls="table-settings-actions-menu"
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleOpen}
        >
          {mode === "create" ? <ImportIcon /> : <ExportIcon />}
        </IconButton>
      </Tooltip>

      <Menu
        id="table-settings-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "table-settings-actions-button" }}
        disablePortal
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Suspense
          fallback={
            <>
              <MenuItem disabled>Loading table settings…</MenuItem>
              <MenuItem disabled />
            </>
          }
        >
          <ImportSettings
            closeMenu={handleClose}
            control={control}
            useFormMethods={useFormMethods}
          />
          <ExportSettings closeMenu={handleClose} control={control} />
        </Suspense>
      </Menu>
    </>
  );
}
