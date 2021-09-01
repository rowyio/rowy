import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { useFieldStyles } from "components/SideDrawer/Form/utils";
import { getDurationString } from "./utils";

export default function Duration({ column, control }: ISideDrawerFieldProps) {
  const fieldClasses = useFieldStyles();

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ value }) => {
        if (
          !value ||
          !value.start ||
          !("toDate" in value.start) ||
          !value.end ||
          !("toDate" in value.end)
        )
          return <div className={fieldClasses.root} />;

        return (
          <div className={fieldClasses.root}>
            {getDurationString(value.start.toDate(), value.end.toDate())}
          </div>
        );
      }}
    />
  );
}
