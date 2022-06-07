import type {
  where,
  orderBy,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";
import { IExtension } from "@src/components/TableModals/ExtensionsModal/utils";
import { IWebhook } from "@src/components/TableModals/WebhooksModal/utils";

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
  filtersOverridable?: boolean;

  functionConfigPath?: string;
  functionBuilderRef?: any;

  extensionObjects?: IExtension[];
  compiledExtension?: string;
  webhooks?: IWebhook[];

  /** @deprecated Migrate to Extensions */
  sparks?: string;
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

  config?: {
    /** Set column to required */
    required?: boolean;
    /** Set column default value */
    defaultValue?: {
      type: "undefined" | "null" | "static" | "dynamic";
      value?: any;
      script?: string;
      dynamicValueFn?: string;
    };
    /** FieldType to render for Derivative fields */
    renderFieldType?: FieldType;
    /** For sub-table fields */
    parentLabel?: string[];

    primaryKeys?: string[];

    /** Column-specific config */
    [key: string]: any;
  };
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

export type FileValue = {
  ref: string;
  downloadURL: string;
  name: string;
  type: string;
  lastModifiedTS: number;
};
