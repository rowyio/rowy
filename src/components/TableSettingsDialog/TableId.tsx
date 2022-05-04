import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import { camelCase } from "lodash-es";
import {
  ShortTextComponent,
  IShortTextComponentProps,
} from "@rowy/form-builder";

export interface ITableIdProps extends IShortTextComponentProps {
  watchedField?: string;
}

export default function TableId({ watchedField, ...props }: ITableIdProps) {
  const {
    field: { onChange },
    useFormMethods: { control },
    disabled,
  } = props;

  const watchedValue = useWatch({ control, name: watchedField } as any);
  useEffect(() => {
    if (!disabled && typeof watchedValue === "string" && !!watchedValue)
      onChange(camelCase(watchedValue));
  }, [watchedValue, disabled]);

  return (
    <ShortTextComponent
      {...props}
      sx={{ "& .MuiInputBase-input": { fontFamily: "mono" } }}
    />
  );
}
