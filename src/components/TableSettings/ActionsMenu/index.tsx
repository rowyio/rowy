import { useState } from "react";
import { Control } from "react-hook-form";
import type { UseFormReturn, FieldValues } from "react-hook-form";

import { IconButton, Menu } from "@mui/material";
import ExportIcon from "assets/icons/Export";
import ImportIcon from "assets/icons/Import";

import { TableSettingsDialogModes } from "../index";
import ImportSettings from "./ImportSettings";
import ExportSettings from "./ExportSettings";

export interface IActionsMenuProps {
  mode: TableSettingsDialogModes | null;
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
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton
        aria-label="Actions…"
        id="table-settings-actions-button"
        aria-controls="table-settings-actions-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        {mode === TableSettingsDialogModes.create ? (
          <ImportIcon />
        ) : (
          <ExportIcon />
        )}
      </IconButton>

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
        <ImportSettings
          closeMenu={handleClose}
          control={control}
          useFormMethods={useFormMethods}
        />
        <ExportSettings closeMenu={handleClose} control={control} />
      </Menu>
    </>
  );
}
