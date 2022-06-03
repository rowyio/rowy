import { FieldType } from "@src/constants/fields";
import { FormatterProps, EditorProps } from "react-data-grid";
import { Control, UseFormReturn } from "react-hook-form";
import { PopoverProps } from "@mui/material";
import { WhereFilterOp } from "firebase/firestore";
import { ColumnConfig, TableRow, TableRowRef } from "@src/types/table";
import { selectedCellAtom } from "@src/atoms/tableScope";
import { IContextMenuActions } from "./_BasicCell/BasicCellContextMenuActions";

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
    selectedCell: ReturnType<typeof selectedCellAtom["read"]>,
    reset: () => Promise<void>
  ) => IContextMenuActions[];
  TableCell: React.ComponentType<FormatterProps<TableRow>>;
  TableEditor: React.ComponentType<EditorProps<TableRow, any>>;
  SideDrawerField: React.ComponentType<ISideDrawerFieldProps>;
  settings?: React.ComponentType<ISettingsProps>;
  settingsValidator?: (config: Record<string, any>) => Record<string, string>;
  filter?: {
    operators: IFilterOperator[];
    customInput?: React.ComponentType<IFiltersProps>;
    defaultValue?: any;
    valueFormatter?: (value: any) => string;
  };
  sortKey?: string;
  csvExportFormatter?: (value: any, config?: any) => string;
  csvImportParser?: (value: string, config?: any) => any;
}

export interface IBasicCellProps {
  value: any;
  type: FieldType;
  name: string;
}
export interface IHeavyCellProps
  extends IBasicCellProps,
    FormatterProps<TableRow> {
  column: FormatterProps<TableRow>["column"] & { config?: Record<string, any> };
  onSubmit: (value: any) => void;
  docRef: TableRowRef;
  disabled: boolean;
}

export interface IPopoverInlineCellProps extends IHeavyCellProps {
  showPopoverCell: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface IPopoverCellProps extends IPopoverInlineCellProps {
  parentRef: PopoverProps["anchorEl"];
}

export interface ISideDrawerFieldProps {
  column: FormatterProps<TableRow>["column"] & ColumnConfig;
  control: Control;
  docRef: TableRowRef;
  disabled: boolean;

  value: any;
  onSubmit: (value: any) => void;

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

// TODO: WRITE TYPES
export interface IFiltersProps {
  onChange: (key: string) => (value: any) => void;
  [key: string]: any;
}

export interface IFilterOperator {
  value: WhereFilterOp;
  label: string;
}
