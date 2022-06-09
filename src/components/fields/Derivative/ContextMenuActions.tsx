import { useAtom } from "jotai";
import { find, get } from "lodash-es";
import { useSnackbar } from "notistack";

import ReEvalIcon from "@mui/icons-material/ReplayOutlined";
import EvalIcon from "@mui/icons-material/PlayCircleOutline";

import { globalScope, rowyRunAtom } from "@src/atoms/globalScope";
import {
  tableScope,
  tableSettingsAtom,
  tableSchemaAtom,
  tableRowsAtom,
} from "@src/atoms/tableScope";
import { getTableSchemaPath } from "@src/utils/table";
import { IFieldConfig } from "@src/components/fields/types";
import { runRoutes } from "@src/constants/runRoutes";

export interface IContextMenuActions {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export const ContextMenuActions: IFieldConfig["contextMenuActions"] = (
  selectedCell,
  reset
) => {
  const [rowyRun] = useAtom(rowyRunAtom, globalScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const selectedCol = tableSchema.columns?.[selectedCell.columnKey];
  if (!selectedCol) return [];

  const selectedRow = find(tableRows, ["_rowy_ref.path", selectedCell.path]);
  const cellValue = get(selectedRow, selectedCol.fieldName);

  if (!selectedCol) return [];

  // don't show evaluate button if function has external dependency
  const code =
    selectedCol.config?.derivativeFn ?? selectedCol.config?.script ?? "";
  if (code.includes("require(")) return [];

  const handleEvaluate = async () => {
    try {
      if (!selectedCol || !rowyRun || !selectedRow) return;
      reset();
      const evaluatingSnackKey = enqueueSnackbar("Evaluating...", {
        variant: "info",
      });
      const result = await rowyRun({
        route: runRoutes.evaluateDerivative,
        body: {
          ref: { path: selectedCell.path },
          schemaDocPath: getTableSchemaPath(tableSettings),
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
};

export default ContextMenuActions;
