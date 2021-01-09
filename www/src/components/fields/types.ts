import { FieldType } from "constants/fields";

import { FormatterProps, EditorProps } from "react-data-grid";
import { Control } from "react-hook-form";

export { FieldType };

export interface IFieldConfig {
  type: FieldType;
  name: string;
  dataType: string;
  initialValue: any;
  icon?: React.ReactNode;
  description?: string;
  setupGuideLink?: string;
  TableCell: React.ComponentType<FormatterProps>;
  TableEditor: React.ComponentType<EditorProps<any>>;
  SideDrawerField: React.ComponentType<ISideDrawerFieldProps>;
  settings?: React.ComponentType<ISettingsProps>;
  csvExport?: (value: any) => string;
  csvImportParser?: (value: string) => any;
}

export interface ICustomCellProps extends FormatterProps<any> {
  column: FormatterProps<any>["column"] & { config?: Record<string, any> };
  value: any;
  onSubmit: (value: any) => void;
  docRef: firebase.firestore.DocumentReference;
  disabled: boolean;
}

export interface IBasicCellProps {
  value: any;
  type: FieldType;
  name: string;
}

export interface ISideDrawerFieldProps {
  column: FormatterProps<any>["column"] & { config?: Record<string, any> };
  control: Control;
  docRef: firebase.firestore.DocumentReference;
  disabled: boolean;
}

export interface ISettingsProps {
  handleChange: (key: string) => (value: any) => void;
  config: Record<string, any>;
}
