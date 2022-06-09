import { useAtom } from "jotai";

import { Menu } from "@mui/material";
import MenuContents from "./MenuContents";

import { tableScope, contextMenuTargetAtom } from "@src/atoms/tableScope";

export default function ContextMenu() {
  const [contextMenuTarget, setContextMenuTarget] = useAtom(
    contextMenuTargetAtom,
    tableScope
  );

  const handleClose = () => setContextMenuTarget(null);

  return (
    <Menu
      id="cell-context-menu"
      aria-label="Cell context menu"
      anchorEl={contextMenuTarget as any}
      open={Boolean(contextMenuTarget)}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      sx={{ "& .MuiMenu-paper": { minWidth: 150 } }}
    >
      <MenuContents onClose={handleClose} />
    </Menu>
  );
}
