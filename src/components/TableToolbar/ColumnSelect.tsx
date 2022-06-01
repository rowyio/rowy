import { useAtom } from "jotai";

import MultiSelect, { MultiSelectProps } from "@rowy/multiselect";
import { Stack, StackProps, Typography } from "@mui/material";

import { globalScope, altPressAtom } from "@src/atoms/globalScope";
import { tableScope, tableColumnsOrderedAtom } from "@src/atoms/tableScope";
import { ColumnConfig } from "@src/types/table";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";

export type ColumnOption = {
  value: string;
  label: string;
  type: FieldType;
  index: number;
};

export interface IColumnSelectProps {
  filterColumns?: (column: ColumnConfig) => boolean;
  options?: ColumnOption[];
}

export default function ColumnSelect({
  filterColumns,
  ...props
}: IColumnSelectProps & Omit<MultiSelectProps<string>, "options">) {
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  const options = (
    filterColumns
      ? tableColumnsOrdered.filter(filterColumns)
      : tableColumnsOrdered
  ).map(({ key, name, type, index }) => ({
    value: key,
    label: name,
    type,
    index,
  }));

  return (
    <MultiSelect
      options={options}
      label="Column"
      labelPlural="columns"
      {...(props as any)}
      itemRenderer={(option: ColumnOption) => <ColumnItem option={option} />}
      TextFieldProps={{
        ...props.TextFieldProps,
        SelectProps: {
          ...props.TextFieldProps?.SelectProps,
          renderValue: () => {
            if (Array.isArray(props.value) && props.value.length > 1)
              return `${props.value.length} columns`;

            const value = Array.isArray(props.value)
              ? props.value[0]
              : props.value;
            const option = options.find((o) => o.value === value);
            return option ? (
              <ColumnItem
                option={option}
                sx={{ "& .MuiSvgIcon-root": { my: -0.25 } }}
              />
            ) : (
              value
            );
          },
        },
      }}
    />
  );
}

export interface IColumnItemProps extends Partial<StackProps> {
  option: ColumnOption;
  children?: React.ReactNode;
}

export function ColumnItem({ option, children, ...props }: IColumnItemProps) {
  const [altPress] = useAtom(altPressAtom, globalScope);

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      {...props}
      sx={[
        { color: "text.secondary", width: "100%" },
        ...(Array.isArray(props.sx) ? props.sx : props.sx ? [props.sx] : []),
      ]}
    >
      {getFieldProp("icon", option.type)}
      <Typography color="text.primary" style={{ flexGrow: 1 }}>
        {altPress ? <code>{option.value}</code> : option.label}
      </Typography>
      {altPress && (
        <Typography
          color="text.disabled"
          variant="caption"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {option.index}
        </Typography>
      )}
      {children}
    </Stack>
  );
}
