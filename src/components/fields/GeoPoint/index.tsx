import { lazy } from "react";
import { GeoPoint } from "firebase/firestore";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withBasicCell from "@src/components/fields/_withTableCell/withBasicCell";

import GeoPointIcon from "@mui/icons-material/PinDropOutlined";
import withSideDrawerEditor from "@src/components/Table/editors/withSideDrawerEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-GeoPoint" */)
);
const SideDrawerField = lazy(
  () =>
    import(
      "./SideDrawerField" /* webpackChunkName: "SideDrawerField-GeoPoint" */
    )
);

export const config: IFieldConfig = {
  type: FieldType.geoPoint,
  name: "GeoPoint (Alpha)",
  group: "Numeric",
  dataType: "{latitude:number; longitude:number}",
  initialValue: {},
  icon: <GeoPointIcon />,
  description: "Geo point is represented as latitude/longitude pair.",
  TableCell: withBasicCell(TableCell),
  TableEditor: withSideDrawerEditor(TableCell),
  SideDrawerField,
  csvImportParser: (value: string) => {
    try {
      const { latitude, longitude } = JSON.parse(value);
      if (latitude && longitude) {
        return new GeoPoint(latitude, longitude);
      }
      throw new Error();
    } catch (e) {
      console.error("Invalid Geopoint value");
      return null;
    }
  },
};
export default config;
