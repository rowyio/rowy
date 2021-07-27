import { IFieldConfig, FieldType } from "components/fields/types";
import withBasicCell from "../_withTableCell/withBasicCell";

import AggregateIcon from "@material-ui/icons/Layers";
import BasicCell from "../_BasicCell/BasicCellNull";
import NullEditor from "components/Table/editors/NullEditor";

export const config: IFieldConfig = {
  type: FieldType.aggregate,
  name: "Aggregate",
  dataType: "string",
  initialValue: "",
  initializable: false,
  icon: <AggregateIcon />,
  description:
    "Value aggregated from a specified sub-table of the row. Displayed using any other field type. Requires Cloud Function setup.",
  TableCell: withBasicCell(BasicCell),
  TableEditor: NullEditor,
  SideDrawerField: BasicCell as any,
};
export default config;
