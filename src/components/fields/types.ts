import { FieldType } from "@src/constants/fields";
import type { TableCellProps } from "@src/components/Table";
import { FormatterProps, EditorProps } from "react-data-grid";
import { Control, UseFormReturn } from "react-hook-form";
import { PopoverProps } from "@mui/material";
import {
  ColumnConfig,
  TableRow,
  TableRowRef,
  TableFilter,
} from "@src/types/table";
import { SelectedCell } from "@src/atoms/tableScope";
import { IContextMenuItem } from "@src/components/Table/ContextMenu/ContextMenuItem";

export { FieldType };

export interface IFieldConfig {
  type: FieldType;
  name: string;
  group: string;
  dataType: string;
  initializable?: boolean;
  requireConfiguration?: boolean;
  initialValue: any;
  icon?: React.ReactNode;
  description?: string;
  setupGuideLink?: string;
  contextMenuActions?: (
    selectedCell: SelectedCell,
    reset: () => void
  ) => IContextMenuItem[];
  TableCell: React.ComponentType<TableCellProps>;
  /** @deprecated TODO: REMOVE */
  TableEditor?: React.ComponentType<EditorProps<TableRow, any>>;
  SideDrawerField: React.ComponentType<ISideDrawerFieldProps>;
  settings?: React.ComponentType<ISettingsProps>;
  settingsValidator?: (config: Record<string, any>) => Record<string, string>;
  filter?: {
    operators: IFilterOperator[];
    customInput?: React.ComponentType<IFilterCustomInputProps>;
    defaultValue?: any;
    valueFormatter?: (value: any, operator: TableFilter["operator"]) => string;
  };
  sortKey?: string;
  csvExportFormatter?: (value: any, config?: any) => string;
  csvImportParser?: (value: string, config?: any) => any;
}

/** @deprecated TODO: REMOVE */
export interface IBasicCellProps {
  value: any;
  type: FieldType;
  name: string;
}
/** @deprecated TODO: REMOVE */
export interface IHeavyCellProps extends IBasicCellProps {
  row: TableRow;
  column: ColumnConfig;
  onSubmit: (value: any) => void;
  docRef: TableRowRef;
  disabled: boolean;
}
/** @deprecated TODO: REMOVE */
export interface IPopoverInlineCellProps extends IHeavyCellProps {
  showPopoverCell: React.Dispatch<React.SetStateAction<boolean>>;
}
/** @deprecated TODO: REMOVE */
export interface IPopoverCellProps extends IPopoverInlineCellProps {
  parentRef: PopoverProps["anchorEl"];
}

export interface IDisplayCellProps<T = any> {
  value: T;
  type: FieldType;
  name: string;
  row: TableRow;
  column: ColumnConfig;
  docRef: TableRowRef;
  disabled: boolean;
  showPopoverCell: (value: boolean) => void;
  setFocusInsideCell: (focusInside: boolean) => void;
}
export interface IEditorCellProps<T = any> extends IDisplayCellProps<T> {
  onSubmit: (value: T) => void;
  tabIndex: number;
  parentRef: PopoverProps["anchorEl"];
}

/** Props to be passed to all SideDrawerFields */
export interface ISideDrawerFieldProps {
  /** The column config */
  column: FormatterProps<TableRow>["column"] & ColumnConfig;
  /** The row’s _rowy_ref object */
  _rowy_ref: TableRowRef;

  /** The field’s local value – synced with db when field is not dirty */
  value: any;
  /** Call when the user has input but changes have not been saved */
  onDirty: () => void;
  /** Update the local value. Also calls onDirty */
  onChange: (value: any) => void;
  /** Call when user input is ready to be saved (e.g. onBlur) */
  onSubmit: () => void;

  /** Field locked. Do NOT check `column.locked` */
  disabled: boolean;

  /** @deprecated */
  docRef: TableRowRef;
  /** @deprecated */
  control: Control;
  /** @deprecated */
  useFormMethods: UseFormReturn;
}

export interface ISettingsProps {
  onChange: (key: string) => (value: any) => void;
  config: Record<string, any>;
  fieldName: string;
  onBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  errors: Record<string, any>;
}

export interface IFilterOperator {
  value: TableFilter["operator"];
  label: string;
  secondaryLabel?: React.ReactNode;
  group?: string;
}

export interface IFilterCustomInputProps {
  onChange: (value: any) => void;
  operator: TableFilter["operator"];
  [key: string]: any;
}
