import type {
  where,
  orderBy,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";

/**
 * A standard function to update a doc in the database
 * @param update - The updates to be deeply merged with the existing doc. Note arrays should be ovewritten to match Firestore set with merge behavior
 * @param deleteFields - Optionally, fields to be deleted from the doc. Access nested fields with dot notation
 * @returns Promise when complete
 */
export type UpdateDocFunction<T = TableRow> = (
  update: Partial<T>,
  deleteFields?: string[]
) => Promise<void>;

/**
 * A standard function to update a doc in a specific collection in the database
 * @param path - The full path to the doc
 * @param update - The updates to be deeply merged with the existing doc. Note arrays should be ovewritten to match Firestore set with merge behavior
 * @param deleteFields - Optionally, fields to be deleted from the doc. Access nested fields with dot notation
 * @returns Promise when complete
 */
export type UpdateCollectionDocFunction<T = TableRow> = (
  path: string,
  update: Partial<T>,
  deleteFields?: string[]
) => Promise<void>;

/**
 * A standard function to delete a doc in a specific collection in the database
 * @param path - The full path to the doc
 * @returns Promise when complete
 */
export type DeleteCollectionDocFunction = (path: string) => Promise<void>;

/** Table settings stored in project settings */
export type TableSettings = {
  id: string;
  collection: string;
  name: string;
  /** Roles that can see this table in the UI and navigate. Firestore Rules need to be set to give access to the data */
  roles: string[];

  section: string;
  description?: string;

  tableType: "primaryCollection" | "collectionGroup";

  audit?: boolean;
  auditFieldCreatedBy?: string;
  auditFieldUpdatedBy?: string;
  readOnly?: boolean;
};

/** Table schema document loaded when table or table settings dialog is open */
export type TableSchema = {
  columns?: Record<string, ColumnConfig>;
  rowHeight?: number;
  filters?: TableFilter[];

  functionConfigPath?: string;
  functionBuilderRef?: any;

  extensionObjects?: any[];
  webhooks?: any[];
};

export type ColumnConfig = {
  /** Unique key for this column. Currently set to the same as fieldName */
  key: string;
  /** Field key/name stored in document */
  fieldName: string;
  /** User-facing name */
  name: string;
  /** Field type stored in config */
  type: FieldType;

  /** Column index set by addColumn, updateColumn functions */
  index: number;

  width?: number;
  editable?: boolean;

  /** Column-specific config */
  config?: {
    required?: boolean;
    defaultValue?: {
      type: "undefined" | "null" | "static" | "dynamic";
      value?: any;
      script?: string;
      dynamicValueFn?: string;
    };

    [key: string]: any;
  };
  // [key: string]: any;
};

export type TableFilter = {
  key: string;
  operator: Parameters<typeof where>[1];
  value: any;
};

export type TableOrder = {
  key: string;
  direction: Parameters<typeof orderBy>[1];
};

export type TableRowRef = {
  id: string;
  path: string;
} & Partial<DocumentReference>;

export type TableRow = DocumentData & {
  _rowy_ref: TableRowRef;
  _rowy_missingRequiredFields?: string[];
  _rowy_outOfOrder?: boolean;
};
