import { FieldType } from "@src/constants/fields";
import { IRenderedTableCellProps } from "@src/components/Table/TableCell/withRenderTableCell";
import type { PopoverProps } from "@mui/material";
import type {
  ColumnConfig,
  TableRow,
  TableRowRef,
  TableFilter,
} from "@src/types/table";
import type { SelectedCell } from "@src/atoms/tableScope";
import type { IContextMenuItem } from "@src/components/Table/ContextMenu/ContextMenuItem";

export { FieldType };

export interface IFieldConfig {
  type: FieldType;
  name: string;
  group: string;
  dataType: string;
  initializable?: boolean;
  requireConfiguration?: boolean;
  requireCloudFunction?: boolean;
  requireCollectionTable?: boolean;
  initialValue: any;
  icon?: React.ReactNode;
  description?: string;
  setupGuideLink?: string;
  contextMenuActions?: (
    selectedCell: SelectedCell,
    reset: () => void
  ) => IContextMenuItem[];
  TableCell: React.ComponentType<IRenderedTableCellProps>;
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

/** See {@link IRenderedTableCellProps | `withRenderTableCell` } for guidance */
export interface IDisplayCellProps<T = any> {
  value: T;
  type: FieldType;
  name: string;
  row: TableRow;
  column: ColumnConfig;
  /** The row’s _rowy_ref object */
  _rowy_ref: TableRowRef;
  disabled: boolean;
  /**
   * ⚠️ Make sure to use the `tabIndex` prop for buttons and other interactive
   *   elements.
   */
  tabIndex: number;
  showPopoverCell: (value: boolean) => void;
  setFocusInsideCell: (focusInside: boolean) => void;
  rowHeight: number;
}
/** See {@link IRenderedTableCellProps | `withRenderTableCell` } for guidance */
export interface IEditorCellProps<T = any> extends IDisplayCellProps<T> {
  /** Call when the user has input but changes have not been saved */
  onDirty: (dirty?: boolean) => void;
  /** Update the local value. Also calls onDirty */
  onChange: (value: T) => void;
  /** Call when user input is ready to be saved (e.g. onBlur) */
  onSubmit: () => void;
  /** Get parent element for popover positioning */
  parentRef: PopoverProps["anchorEl"];
}

/** Props to be passed to all SideDrawerFields */
export interface ISideDrawerFieldProps<T = any> {
  /** The column config */
  column: ColumnConfig;
  /** The row’s _rowy_ref object */
  _rowy_ref: TableRowRef;
  /** The field’s local value – synced with db when field is not dirty */
  value: T;
  /** Call when the user has input but changes have not been saved */
  onDirty: (dirty?: boolean) => void;
  /** Update the local value. Also calls onDirty */
  onChange: (value: T) => void;
  /** Call when user input is ready to be saved (e.g. onBlur) */

  onSubmit: () => void;
  /** Field locked. Do NOT check `column.locked` */
  disabled: boolean;

  row: TableRow;

  operator?: TableFilter["operator"];
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
