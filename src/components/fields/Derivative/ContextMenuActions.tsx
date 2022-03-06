import _find from "lodash/find";
import _get from "lodash/get";

import Cut from "@mui/icons-material/ContentCut";
import CopyCells from "@src/assets/icons/CopyCells";
import Paste from "@mui/icons-material/ContentPaste";
import EvalIcon from "@mui/icons-material/Replay";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { useSnackbar } from "notistack";
import { SelectedCell } from "@src/atoms/ContextMenu";
import { getFieldProp, getColumnType } from "@src/components/fields";
import { runRoutes } from "@src/constants/runRoutes";

export interface IContextMenuActions {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export default function ContextMenuActions(
  selectedCell: SelectedCell,
  reset: () => void | Promise<void>
): IContextMenuActions[] {
  const { tableState, deleteCell, updateCell, rowyRun } = useProjectContext();
  const { enqueueSnackbar } = useSnackbar();
  const columns = tableState?.columns;
  const rows = tableState?.rows;
  const selectedRowIndex = selectedCell.rowIndex as number;
  const selectedColIndex = selectedCell?.colIndex;
  const selectedCol = _find(columns, { index: selectedColIndex });
  if (!selectedCol) return [];
  const selectedRow = rows?.[selectedRowIndex];
  const cellValue = _get(selectedRow, selectedCol.key);
  console.log({
    selectedCol,
    schemaDocPath: tableState?.config.tableConfig.path,
  });
  const handleClose = async () => await reset?.();

  const handleEvaluate = async () => {
    try {
      if (!selectedCol || !rowyRun || !selectedRow) return;
      rowyRun({
        route: runRoutes.evaluateDerivative,
        body: {
          ref: {
            path: selectedRow.ref.path,
          },
          schemaDocPath: tableState?.config.tableConfig.path,
          columnKey: selectedCol.key,
        },
      });
    } catch (error) {
      enqueueSnackbar(`Failed: ${error}`, { variant: "error" });
    }
    handleClose();
  };
  const contextMenuActions = [
    { label: "evalute", icon: <EvalIcon />, onClick: handleEvaluate },
  ];

  return contextMenuActions;
}
