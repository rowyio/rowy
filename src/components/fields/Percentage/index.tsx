import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withHeavyCell from "@src/components/fields/_withTableCell/withHeavyCell";

import { Percentage as PercentageIcon } from "@src/assets/icons";
import TextEditor from "@src/components/Table/editors/TextEditor";
import { filterOperators } from "@src/components/fields/Number/Filter";
import BasicContextMenuActions from "@src/components/fields/_BasicCell/BasicCellContextMenuActions";

const BasicCell = lazy(
  () => import("./BasicCell" /* webpackChunkName: "BasicCell-Percentage" */)
);

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Percentage" */)
);

const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-Percentage" */
    )
);

const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-Percentage" */)
);

export const config: IFieldConfig = {
  type: FieldType.percentage,
  name: "Percentage",
  group: "Numeric",
  dataType: "number",
  initialValue: 0,
  initializable: true,
  icon: <PercentageIcon />,
  requireConfiguration: true,
  description: "Percentage stored as a number between 0 and 1.",
  contextMenuActions: BasicContextMenuActions,
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: TextEditor,
  SideDrawerField,
  settings: Settings,
  filter: {
    operators: filterOperators,
  },
  csvImportParser: (v) => {
    try {
      const parsedValue = parseFloat(v);
      return Number.isNaN(parsedValue) ? null : parsedValue;
    } catch (e) {
      return null;
    }
  },
};
export default config;
