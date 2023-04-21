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
      if (typeof value === "string" && value.trim() !== "") {
        onChange(value);
      } else if (typeof watchedValue === "string" && !!watchedValue) {
        onChange(startCase(watchedValue));
      }
    }
  }, [watchedValue, disabled, onChange, value]);

  return <ShortTextComponent {...props} />;
}
