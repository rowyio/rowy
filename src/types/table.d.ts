import type {
  where,
  orderBy,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";
import {
  IExtension,
  IRuntimeOptions,
} from "@src/components/TableModals/ExtensionsModal/utils";
import { IWebhook } from "@src/components/TableModals/WebhooksModal/utils";

/**
 * A standard function to update a doc in the database
 * @param update - The updates to be deeply merged with the existing doc. Note arrays should be ovewritten to match Firestore set with merge behavior
 * @param deleteFields - Optionally, fields to be deleted from the doc. Access nested fields with dot notation
 * @returns Promise
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
 * @param options - Optionally, filed to pass extra data to the function
 * @returns Promise
 */
export type UpdateCollectionDocFunction<T = TableRow> = (
  path: string,
  update: Partial<T>,
  deleteFields?: string[],
  options?: ArrayTableRowData & { useSet?: boolean }
) => Promise<void>;

/**
 * A standard function to delete a doc in a specific collection in the database
 * @param path - The full path to the doc
 * @returns Promise
 */
export type DeleteCollectionDocFunction = (
  path: string,
  options?: ArrayTableRowData
) => Promise<void>;

export type BulkWriteOperation<T> =
  | { type: "delete"; path: string }
  | { type: "add"; path: string; data: T }
  | { type: "update"; path: string; data: Partial<T>; deleteFields?: string[] };
/**
 * A standard function to write bulk updates to the database
 * @param operations - {@link BulkWriteOperation}
 * @returns Promise
 */
export type BulkWriteFunction<T = Partial<TableRow>> = (
  operations: BulkWriteOperation<T>[],
  onBatchCommit?: (batchNumber: number) => void
) => Promise<void>;

/**
 * Store the next page state to know if it’s loading and if it’s available
 */
export type NextPageState = {
  loading: boolean = false;
  available: boolean = true;
};

/** Table settings stored in project settings */
export type TableSettings = {
  id: string;
  collection: string;
  name: string;
  /** Roles that can see this table in the UI and navigate. Firestore Rules need to be set to give access to the data */
  roles: string[];

  isCollection?: boolean;
  subTableKey?: string | undefined;
  section: string;
  description?: string;
  details?: string;
  thumbnailURL?: string;
  modifiableBy?: string[];

  _createdBy?: {
    displayName?: string;
    email?: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    photoURL?: string;
    uid: string;
    timestamp: firebase.firestore.Timestamp;
  };

  tableType: "primaryCollection" | "collectionGroup";

  audit?: boolean;
  auditFieldCreatedBy?: string;
  auditFieldUpdatedBy?: string;
  readOnly?: boolean;
};

export type TableIdType = "decrement" | "random" | "custom";

/** Table schema document loaded when table or table settings dialog is open */
export type TableSchema = {
  columns?: Record<string, ColumnConfig>;
  idType?: TableIdType;
  rowHeight?: number;
  filters?: TableFilter[];
  filtersOverridable?: boolean;
  sorts?: TableSort[];

  functionConfigPath?: string;
  functionBuilderRef?: any;

  extensionObjects?: IExtension[];
  compiledExtension?: string;
  webhooks?: IWebhook[];
  runtimeOptions?: IRuntimeOptions;

  subTables?: SubTablesSchema;
  /** @deprecated Migrate to Extensions */
  sparks?: string;

  joinOperator?: "AND" | "OR";
};

export type SubTablesSchema = {
  [key: string]: TableSchema;
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

  /** Set column width for all users */
  width?: number;
  /** If false (not undefined), locks the column for all users */
  editable?: boolean = true;
  /** Hide the column for all users */
  hidden?: boolean = false;
  /** Freeze the column to the left */
  fixed?: boolean = false;
  /** Prevent column resizability */
  resizable?: boolean = true;

  config?: Partial<{
    /** Set column to required */
    required: boolean;
    /** Set column default value */
    defaultValue: {
      type: "undefined" | "null" | "static" | "dynamic";
      value?: any;
      script?: string;
      dynamicValueFn?: string;
    };
    /** Regex used in CellValidation */
    validationRegex: string;
    /** FieldType to render for Derivative fields */
    renderFieldType?: FieldType;
    /** Used in Derivative fields */
    listenerFields?: string[];
    /** Used in Derivative and Action fields */
    requiredFields?: string[];
    /** For sub-table fields */
    parentLabel: string[];

    primaryKeys: string[];

    /** Column-specific config */
    [key: string]: any;
  }>;
};

export type TableFilter = {
  key: string;
  operator:
    | Parameters<typeof where>[1]
    | "date-equal"
    | "date-before"
    | "date-after"
    | "date-before-equal"
    | "date-after-equal"
    | "time-minute-equal"
    | "id-equal"
    | "color-equal"
    | "color-not-equal"
    | "is-empty"
    | "is-not-empty";
  value: any;
  id: string;
};

export const TableTools = [
  "import",
  "export",
  "webhooks",
  "extensions",
  "cloud_logs",
] as const;
export type TableToolsType = typeof Tools[number];

export type TableSort = {
  key: string;
  direction: Parameters<typeof orderBy>[1];
};

export type ArrayTableRowData = {
  index?: number;
  parentField?: string;
  operation?: ArrayTableOperations;
};

export type TableRowRef = {
  id: string;
  path: string;
  arrayTableData?: ArrayTableRowData;
} & Partial<DocumentReference>;

type ArrayTableOperations = {
  addRow?: "top" | "bottom";
  base?: TableRow;
};

export type TableRow = DocumentData & {
  _rowy_ref: TableRowRef;
  _rowy_missingRequiredFields?: string[];
  _rowy_outOfOrder?: boolean;
};

export type FileValue = {
  ref: string;
  downloadURL: string;
  name: string;
  type: string;
  lastModifiedTS: number;
};
