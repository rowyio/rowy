import { find, get } from "lodash-es";

import { FieldType } from "@src/constants/fields";
import { IFieldConfig } from "./types";

// Import field configs
import ShortText from "./ShortText";
import LongText from "./LongText";
import RichText from "./RichText";
import Email from "./Email";
import Phone from "./Phone";
import Url from "./Url";
import SingleSelect from "./SingleSelect";
import MultiSelect from "./MultiSelect";
import Number_ from "./Number";
import Checkbox from "./Checkbox";
import Percentage from "./Percentage";
import Rating from "./Rating";
import Slider from "./Slider";
import Color from "./Color";
import GeoPoint from "./GeoPoint";
import Date_ from "./Date";
import DateTime from "./DateTime";
import Duration from "./Duration";
import Image_ from "./Image";
import File_ from "./File";
import Connector from "./Connector";
import SubTable from "./SubTable";
import ArraySubTable from "./ArraySubTable";
import Reference from "./Reference";
import ConnectTable from "./ConnectTable";
import ConnectService from "./ConnectService";
import Json from "./Json";
import Code from "./Code";
import Array from "./Array";
import Action from "./Action";
import Derivative from "./Derivative";
import Formula from "./Formula";
import Markdown from "./Markdown";
// // import Aggregate from "./Aggregate";
import Status from "./Status";
import CreatedBy from "./CreatedBy";
import UpdatedBy from "./UpdatedBy";
import CreatedAt from "./CreatedAt";
import UpdatedAt from "./UpdatedAt";
import User from "./User";
import Id from "./Id";
import { ColumnConfig } from "@src/types/table";

// Export field configs in order for FieldsDropdown
export const FIELDS: IFieldConfig[] = [
  /** TEXT */
  ShortText,
  LongText,
  RichText,
  Email,
  Phone,
  Url,
  /** SELECT */
  SingleSelect,
  MultiSelect,
  /** NUMERIC */
  Number_,
  Checkbox,
  Percentage,
  Rating,
  Slider,
  Color,
  GeoPoint,
  /** DATE & TIME */
  Date_,
  DateTime,
  Duration,
  /** FILE */
  Image_,
  File_,
  /** CONNECTION */
  Connector,
  ArraySubTable,
  SubTable,
  Reference,
  ConnectTable,
  ConnectService,
  /** CODE */
  Json,
  Code,
  Markdown,
  Array,
  /** CLOUD FUNCTION */
  Action,
  Derivative,
  // // Aggregate,
  Status,
  /** CLIENT FUNCTION */
  Formula,
  /** AUDITING */
  CreatedBy,
  UpdatedBy,
  CreatedAt,
  UpdatedAt,
  /** METADATA */
  User,
  Id,
];

/**
 * Returns specific property of field config
 * @param prop - The field config prop to retrieve
 * @param fieldType - The field type to get the config from
 * @returns The field config prop value
 */
export const getFieldProp = (
  prop: keyof IFieldConfig,
  fieldType: FieldType
) => {
  const field = find(FIELDS, { type: fieldType });
  return get(field, prop);
};

/**
 * Returns `true` if it receives an existing fieldType
 * @param fieldType - The field type to check
 * @returns boolean
 */
export const isFieldType = (fieldType: any) => {
  const fieldTypes = FIELDS.map((field) => field.type);
  return fieldTypes.includes(fieldType);
};

/**
 * Returns array of fieldTypes with dataType included dataTypes array
 * @param dataTypes - The dataTypes to check
 * @returns array of fieldTypes
 */
export const hasDataTypes = (dataTypes: string[]) => {
  const fieldTypes = FIELDS.map((field) => field.type);
  return fieldTypes.filter((fieldType) =>
    dataTypes.includes(getFieldProp("dataType", fieldType))
  );
};

/**
 * Returns the FieldType of a config. Used for Derivative fields.
 * @param column - The column to check
 * @returns FieldType
 */
export const getFieldType = (
  column: Pick<ColumnConfig, "type" | "config"> & Partial<ColumnConfig>
) =>
  column.type === FieldType.derivative
    ? column.config?.renderFieldType
    : column.type;
