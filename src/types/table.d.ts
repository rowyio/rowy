import type {
  where,
  orderBy,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";

export type UpdateDocFunction<T = TableRow> = (
  update: Partial<T>
) => Promise<void>;

export type UpdateCollectionFunction<T = TableRow> = (
  path: string,
  update: Partial<T>
) => Promise<void>;

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
  config: { [key: string]: any };
  // [key: string]: any;
};

export type TableFilter = {
  key: Parameters<typeof where>[0];
  operator: Parameters<typeof where>[1];
  value: Parameters<typeof where>[2];
};

export type TableOrder = {
  key: Parameters<typeof orderBy>[0];
  direction: Parameters<typeof orderBy>[1];
};

export type TableRow = DocumentData & {
  _rowy_id: string;
  _rowy_ref: { id: string; path: string } & Partial<DocumentReference>;

  _rowy_missingRequiredFields?: string[];
  _rowy_outOfOrder?: boolean;
};
