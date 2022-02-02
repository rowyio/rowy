import _find from "lodash/find";
import CopyCells from "@src/assets/icons/CopyCells";
import Cut from "@src/assets/icons/Cut";
import Paste from "@src/assets/icons/Paste";
import { useProjectContext } from "@src/contexts/ProjectContext";

export default function BasicContextMenuActions() {
  const { contextMenuRef, tableState, deleteCell, updateCell } =
    useProjectContext();
  const columns = tableState?.columns;
  const rows = tableState?.rows;
  const selectedRowIndex = contextMenuRef?.current?.selectedCell
    .rowIndex as number;
  const selectedColIndex = contextMenuRef?.current?.selectedCell?.colIndex;
  const selectedCol = _find(columns, { index: selectedColIndex });
  const selectedRow = rows?.[selectedRowIndex];

  const handleClose = () => {
    contextMenuRef?.current?.setSelectedCell(null);
    contextMenuRef?.current?.setAnchorEl(null);
  };

  const handleCopy = () => {
    const cell = selectedRow?.[selectedCol.key];
    // const onFail = () => console.log("Fail to copy");
    // const onSuccess = () => console.log("Save to clipboard successful");
    // const copy =
    navigator.clipboard.writeText(JSON.stringify(cell));
    // copy.then(onSuccess, onFail);

    handleClose();
  };

  const handleCut = () => {
    const cell = selectedRow?.[selectedCol.key];
    const notUndefined = Boolean(typeof cell !== "undefined");
    if (deleteCell && notUndefined)
      deleteCell(selectedRow?.ref, selectedCol?.key);

    handleClose();
  };

  const handlePaste = () => {
    // console.log("home", rows);
    const paste = navigator.clipboard.readText();
    paste.then(async (clipText) => {
      try {
        const paste = await JSON.parse(clipText);
        updateCell?.(selectedRow?.ref, selectedCol.key, paste);
      } catch (error) {
        //TODO check the coding style guide about error message
        //Add breadcrumb handler her
        // console.log(error);
      }
    });

    handleClose();
  };

  // const handleDisable = () => {
  //     const cell = selectedRow?.[selectedCol.key];
  //     return typeof cell === "undefined" ? true : false;
  // };

  const cellMenuAction = [
    { label: "Cut", icon: <Cut />, onClick: handleCut },
    { label: "Copy", icon: <CopyCells />, onClick: handleCopy },
    { label: "Paste", icon: <Paste />, onClick: handlePaste },
  ];
  return cellMenuAction;
}
