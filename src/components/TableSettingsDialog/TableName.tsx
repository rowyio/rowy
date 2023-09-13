import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import { startCase } from "lodash-es";
import {
  ShortTextComponent,
  IShortTextComponentProps,
} from "@rowy/form-builder";

export interface ITableNameProps extends IShortTextComponentProps {
  watchedField?: string;
}

export default function TableName({ watchedField, ...props }: ITableNameProps) {
  const {
    field: { onChange, value },
    useFormMethods: { control },
    disabled,
  } = props;

  const watchedValue = useWatch({ control, name: watchedField } as any);
  useEffect(() => {
    if (!disabled) {
      const touched = control.getFieldState(props.name).isTouched;

      if (!touched && typeof watchedValue === "string" && !!watchedValue) {
        // if table name field is not touched, and watched value is valid, set table name to watched value
        onChange(startCase(watchedValue));
      } else if (typeof value === "string") {
        // otherwise if table name is valid, set watched value to table name
        onChange(startCase(value.trim()));
      }
    }
  }, [watchedValue, disabled, onChange, value]);

  return <ShortTextComponent {...props} />;
}
