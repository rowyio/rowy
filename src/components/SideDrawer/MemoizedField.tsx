import { memo, useEffect, useCallback, createElement } from "react";
import useStateRef from "react-usestateref";
import { isEqual, isEmpty } from "lodash-es";

import FieldWrapper from "./FieldWrapper";
import { FieldType, IFieldConfig } from "@src/components/fields/types";
import { getFieldProp } from "@src/components/fields";
import { ColumnConfig, TableRowRef } from "@src/types/table";
import { TableRow } from "@src/types/table";

export interface IMemoizedFieldProps {
  field: ColumnConfig;
  disabled: boolean;
  hidden: boolean;
  value: any;
  _rowy_ref: TableRowRef;
  isDirty: boolean;
  onDirty: (fieldName: string) => void;
  onSubmit: (fieldName: string, value: any) => void;
  row: TableRow;
}

export const MemoizedField = memo(
  function MemoizedField({
    field,
    disabled,
    hidden,
    value,
    _rowy_ref,
    isDirty,
    onDirty,
    onSubmit,
    row,
    ...props
  }: IMemoizedFieldProps) {
    const [localValue, setLocalValue, localValueRef] = useStateRef(value);
    // Sync local value with document value if not dirty
    useEffect(() => {
      if (!isDirty) setLocalValue(value);
    }, [isDirty, setLocalValue, value]);

    const handleSubmit = useCallback(() => {
      onSubmit(field.fieldName, localValueRef.current);
    }, [field.fieldName, localValueRef, onSubmit]);

    let type = field.type;
    if (field.type !== FieldType.formula && field.config?.renderFieldType) {
      type = field.config.renderFieldType;
    }

    const fieldComponent: IFieldConfig["SideDrawerField"] = getFieldProp(
      "SideDrawerField",
      type
    );

    // Should not reach this state
    if (isEmpty(fieldComponent)) {
      console.error("Could not find SideDrawerField component", field);
      return null;
    }

    return (
      <FieldWrapper
        type={field.type}
        fieldName={field.fieldName}
        label={field.name}
        disabled={disabled}
        hidden={hidden}
        index={field.index}
        {...props}
      >
        {createElement(fieldComponent, {
          column: field as any,
          _rowy_ref,
          value: localValue,
          onDirty: () => onDirty(field.key),
          onChange: (value: any) => {
            setLocalValue(value);
            onDirty(field.key);
          },
          onSubmit: handleSubmit,
          disabled,
          row,
        })}
      </FieldWrapper>
    );
  },
  (prev, next) => {
    // If hidden or disabled change, re-render
    if (prev.hidden !== next.hidden || prev.disabled !== next.disabled) {
      return false;
    }

    // Re-render if column config changes
    if (!isEqual(prev.field, next.field)) return false;

    // If dirty, don’t re-render. This has the effect of the field only
    // being re-rendered if it’s not dirty.
    if (prev.isDirty || next.isDirty) return true;

    // Don’t render if values are deep equal
    return isEqual(prev.value, next.value);
  }
);

export default MemoizedField;
