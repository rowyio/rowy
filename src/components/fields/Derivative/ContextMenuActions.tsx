import _find from "lodash/find";
import _get from "lodash/get";

import ReEvalIcon from "@mui/icons-material/Replay";
import EvalIcon from "@mui/icons-material/PlayCircle";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { useSnackbar } from "notistack";
import { SelectedCell } from "@src/atoms/ContextMenu";
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
  const { tableState, rowyRun } = useProjectContext();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const columns = tableState?.columns;
  const rows = tableState?.rows;
  const selectedRowIndex = selectedCell.rowIndex as number;
  const selectedColIndex = selectedCell?.colIndex;
  const selectedCol = _find(columns, { index: selectedColIndex });
  if (!selectedCol) return [];
  // don't show evalute button if function has external dependency
  const code =
    selectedCol.config.derivativeFn ?? selectedCol.config.script ?? "";
  if (code.includes("require(")) return [];
  const selectedRow = rows?.[selectedRowIndex];
  const cellValue = _get(selectedRow, selectedCol.key);
  const handleClose = async () => await reset?.();

  const handleEvaluate = async () => {
    try {
      if (!selectedCol || !rowyRun || !selectedRow) return;
      handleClose();
      const evaluatingSnackKey = enqueueSnackbar("Evaluating...", {
        variant: "info",
      });
      const result = await rowyRun({
        route: runRoutes.evaluateDerivative,
        body: {
          ref: {
            path: selectedRow.ref.path,
          },
          schemaDocPath: tableState?.config.tableConfig.path,
          columnKey: selectedCol.key,
        },
      });
      closeSnackbar(evaluatingSnackKey);
      if (result.success === false) {
        enqueueSnackbar(result.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(`Failed: ${error}`, { variant: "error" });
    }
  };
  const isEmpty =
    cellValue === "" || cellValue === null || cellValue === undefined;
  const contextMenuActions = [
    {
      label: isEmpty ? "Evaluate" : "Re-evaluate",
      icon: isEmpty ? <EvalIcon /> : <ReEvalIcon />,
      onClick: handleEvaluate,
    },
  ];

  return contextMenuActions;
}
