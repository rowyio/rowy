import { lazy } from "react";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withRenderTableCell from "@src/components/Table/TableCell/withRenderTableCell";

import ConnectorIcon from "@mui/icons-material/Cable";
import DisplayCell from "./DisplayCell";

const EditorCell = lazy(
  () =>
    import("./EditorCell" /* webpackChunkName: "EditorCell-ConnectService" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-Connector" */
    )
);
const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-Connector" */)
);

export const config: IFieldConfig = {
  type: FieldType.connector,
  name: "Connector",
  group: "Connection",
  dataType: "any",
  initialValue: "",
  initializable: true,
  icon: <ConnectorIcon />,
  description:
    "Connects to any table or API to fetch a list of results based on a text query or row data.",
  TableCell: withRenderTableCell(DisplayCell, EditorCell, "popover", {
    disablePadding: true,
  }),
  SideDrawerField,
  requireConfiguration: true,
  requireCloudFunction: true,
  settings: Settings,
};
export default config;
