import { FieldType } from "constants/fields";

import { FormatterProps, EditorProps } from "react-data-grid";
import { Control } from "react-hook-form";
import { PopoverProps } from "@material-ui/core";

export { FieldType };

export interface IFieldConfig {
  type: FieldType;
  name: string;
  dataType: string;
  initializable?: boolean;
  requireConfiguration?: boolean;
  initialValue: any;
  icon?: React.ReactNode;
  description?: string;
  setupGuideLink?: string;
  TableCell: React.ComponentType<FormatterProps>;
  TableEditor: React.ComponentType<EditorProps<any>>;
  SideDrawerField: React.ComponentType<ISideDrawerFieldProps>;
  settings?: React.ComponentType<ISettingsProps>;
  csvExportFormatter?: (value: any, config?: any) => string;
  csvImportParser?: (value: string, config?: any) => any;
}

export interface IBasicCellProps {
  value: any;
  type: FieldType;
  name: string;
}
export interface IHeavyCellProps extends IBasicCellProps, FormatterProps<any> {
  column: FormatterProps<any>["column"] & { config?: Record<string, any> };
  onSubmit: (value: any) => void;
  docRef: firebase.default.firestore.DocumentReference;
  disabled: boolean;
}

export interface IPopoverInlineCellProps extends IHeavyCellProps {
  showPopoverCell: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface IPopoverCellProps extends IPopoverInlineCellProps {
  parentRef: PopoverProps["anchorEl"];
}

export interface ISideDrawerFieldProps {
  column: FormatterProps<any>["column"] & { config?: Record<string, any> };
  control: Control;
  docRef: firebase.default.firestore.DocumentReference;
  disabled: boolean;
}

export interface ISettingsProps {
  handleChange: (key: string) => (value: any) => void;
  config: Record<string, any>;
  // TODO: WRITE TYPES
  tables: any;
  [key: string]: any;
}
