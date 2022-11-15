import { lazy } from "react";
import { GeoPoint } from "firebase/firestore";
import { IFieldConfig, FieldType } from "@src/components/fields/types";
import withTableCell from "@src/components/Table/withTableCell";

import GeoPointIcon from "@mui/icons-material/PinDropOutlined";
import DisplayCell from "./DisplayCell";

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
  TableCell: withTableCell(DisplayCell, SideDrawerField, "popover", {
    popoverProps: { PaperProps: { sx: { p: 1, pt: 0 } } },
  }),
  SideDrawerField,
  csvImportParser: (value: string) => {
    try {
      const { latitude, longitude } = JSON.parse(value);
      if (latitude && longitude) {
        return new GeoPoint(latitude, longitude);
      }
      throw new Error();
    } catch (e) {
      console.error("Invalid GeoPoint value");
      return null;
    }
  },
};
export default config;
