import { useAtom } from "jotai";

import MultiSelect, { MultiSelectProps } from "@rowy/multiselect";
import { Stack, StackProps, Typography, Chip } from "@mui/material";
import { TableColumn as TableColumnIcon } from "@src/assets/icons";

import { projectScope, altPressAtom } from "@src/atoms/projectScope";
import { tableScope, tableColumnsOrderedAtom } from "@src/atoms/tableScope";
import { ColumnConfig } from "@src/types/table";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";
import { spreadSx } from "@src/utils/ui";

export type ColumnOption = {
  value: string;
  label: string;
  type: FieldType;
  index: number;
};

export interface IColumnSelectProps {
  filterColumns?: (column: ColumnConfig) => boolean;
  showFieldNames?: boolean;
  options?: ColumnOption[];
}

export default function ColumnSelect({
  filterColumns,
  showFieldNames,
  ...props
}: IColumnSelectProps & Omit<MultiSelectProps<string>, "options">) {
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  const options =
    props.options ||
    (filterColumns
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
      itemRenderer={(option: ColumnOption) => (
        <ColumnItem option={option} showFieldNames={showFieldNames} />
      )}
      TextFieldProps={{
        ...props.TextFieldProps,
        SelectProps: {
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
                showFieldNames={showFieldNames}
                sx={{ "& .MuiSvgIcon-root": { my: -0.25 } }}
              />
            ) : (
              value
            );
          },
          ...props.TextFieldProps?.SelectProps,
        },
      }}
    />
  );
}

export interface IColumnItemProps extends Partial<StackProps> {
  option: ColumnOption;
  showFieldNames?: boolean;
  children?: React.ReactNode;
}

export function ColumnItem({
  option,
  showFieldNames,
  children,
  ...props
}: IColumnItemProps) {
  const [altPress] = useAtom(altPressAtom, projectScope);

  const isNew = option.index === undefined && !option.type;

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      {...props}
      sx={[{ color: "text.secondary", width: "100%" }, ...spreadSx(props.sx)]}
    >
      {getFieldProp("icon", option.type) ?? (
        <TableColumnIcon color="disabled" />
      )}

      <Typography color="text.primary" style={{ flexGrow: 1 }}>
        {altPress ? <code>{option.value}</code> : option.label}
      </Typography>

      {isNew && (
        <Chip label="New" color="primary" size="small" variant="outlined" />
      )}

      {altPress ? (
        <Typography
          color="text.disabled"
          variant="caption"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {option.index}
        </Typography>
      ) : showFieldNames ? (
        <Typography color="text.primary">
          <code>{option.value}</code>
        </Typography>
      ) : null}
      {children}
    </Stack>
  );
}
