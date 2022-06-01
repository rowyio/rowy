import { useAtom } from "jotai";

import MultiSelect, { MultiSelectProps } from "@rowy/multiselect";
import { Stack, Typography } from "@mui/material";

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
  ).map(({ key, name, type, index, fixed }) => ({
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
    />
  );
}

export function ColumnItem({
  option,
  children,
}: React.PropsWithChildren<{ option: ColumnOption }>) {
  const [altPress] = useAtom(altPressAtom, globalScope);

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      sx={{ color: "text.secondary", width: "100%" }}
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
