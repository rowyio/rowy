import { ISideDrawerFieldProps } from "../types";

import { useTheme } from "@material-ui/core";
import { useFieldStyles } from "components/SideDrawer/Form/utils";

export default function Id({ docRef }: ISideDrawerFieldProps) {
  const theme = useTheme();
  const fieldClasses = useFieldStyles();

  return (
    <div
      className={fieldClasses.root}
      style={{ fontFamily: theme.typography.fontFamilyMono, userSelect: "all" }}
    >
      {docRef.id}
    </div>
  );
}
