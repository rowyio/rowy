import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
// import Divider from '@mui/material/Divider';
// import CopyIcon from '@src/assets/icons/Copy';
// import ContentPaste from '@mui/icons-material/ContentPaste';
import CopyCellsIcon from "@src/assets/icons/CopyCells";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { alpha } from "@mui/material/styles";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { useConfirmation } from "@src/components/ConfirmationDialog/Context";

export default function RowContextMenu({ children, ...rowProps }) {
  const { row } = rowProps;
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const { addRow, deleteRow } = useProjectContext();
  const { requestConfirmation } = useConfirmation();

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX,
            mouseY: event.clientY,
          }
        : null
    );
  };

  // const handleCopy = () => {
  //     // focus and activate cell
  //     dataGridRef?.current?.selectCell({ idx: rowProps.selectedCellIdx, rowIdx: rowProps.rowIdx }, true);
  //     setTimeout(() => {
  //         console.log(cell);
  //         const input = document?.activeElement as HTMLInputElement;
  //         if (input) {
  //             input.select();
  //             navigator.clipboard.writeText(input.value).catch(() => {
  //             });
  //         }
  //     }, 0);
  //     setContextMenu(null);
  // };

  // const handlePaste = () => {
  //     navigator.clipboard.readText().then((text) => {
  //         if (!text) {
  //             setContextMenu(null);
  //             return;
  //         }

  //         setContextMenu(null);
  //     });
  // };

  const handleDuplicateRow = () => {
    const clonedRow = { ...row };
    // remove metadata
    delete clonedRow.ref;
    delete clonedRow.rowHeight;
    Object.keys(clonedRow).forEach((key) => {
      if (clonedRow[key] === undefined) delete clonedRow[key];
    });
    if (addRow) addRow!(clonedRow, undefined, { type: "smaller" });
    setContextMenu(null);
  };

  const handleDeleteRow = () => {
    requestConfirmation({
      title: "Delete row?",
      customBody: (
        <>
          Row path:
          <br />
          <code style={{ userSelect: "all", wordBreak: "break-all" }}>
            {row.ref.path}
          </code>
        </>
      ),
      confirm: "Delete",
      confirmColor: "error",
      handleConfirm: () => {
        if (deleteRow) deleteRow(row.id);
        setContextMenu(null);
      },
    });
  };

  const deleteRowColor = {
    color: "error.main",
    "&:hover": {
      backgroundColor: (theme) =>
        alpha(theme.palette.error.main, theme.palette.action.hoverOpacity),
    },
  };

  return (
    <div onContextMenu={handleContextMenu}>
      {children}
      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {/* <MenuItem onClick={handleCopy}>
                    <ListItemIcon>
                        <CopyIcon />
                    </ListItemIcon>
                    <ListItemText>
                        Copy
                    </ListItemText>
                </MenuItem>
                <MenuItem onClick={handlePaste}>
                    <ListItemIcon>
                        <ContentPaste />
                    </ListItemIcon>
                    <ListItemText>
                        Paste
                    </ListItemText>
                </MenuItem>
                <Divider /> */}
        <MenuItem onClick={handleDuplicateRow}>
          <ListItemIcon>
            <CopyCellsIcon />
          </ListItemIcon>
          <ListItemText>Duplicate Row</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteRow} sx={deleteRowColor}>
          <ListItemIcon sx={deleteRowColor}>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Delete Row</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}
