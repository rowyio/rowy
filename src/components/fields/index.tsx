import _find from "lodash/find";
import _get from "lodash/get";

import { FieldType } from "@src/constants/fields";
import { IFieldConfig } from "./types";

// Import field configs
import ShortText from "./ShortText";
import LongText from "./LongText";
import RichText from "./RichText";
import Email from "./Email";
import Phone from "./Phone";
import Url from "./Url";
import Number_ from "./Number";
import Checkbox from "./Checkbox";
import Percentage from "./Percentage";
import Rating from "./Rating";
import Slider from "./Slider";
import Color from "./Color";
import Date_ from "./Date";
import DateTime from "./DateTime";
import Duration from "./Duration";
import Image_ from "./Image";
import File_ from "./File";
import SingleSelect from "./SingleSelect";
import MultiSelect from "./MultiSelect";
import SubTable from "./SubTable";
import ConnectTable from "./ConnectTable";
import ConnectService from "./ConnectService";
import Json from "./Json";
import Code from "./Code";
import Action from "./Action";
import Derivative from "./Derivative";
// import Aggregate from "./Aggregate";
import CreatedBy from "./CreatedBy";
import UpdatedBy from "./UpdatedBy";
import CreatedAt from "./CreatedAt";
import UpdatedAt from "./UpdatedAt";
import User from "./User";
import Id from "./Id";
import Status from "./Status";
import Connector from "./Connector";
import { TableColumn } from "../Table";

// Export field configs in order for FieldsDropdown
export const FIELDS: IFieldConfig[] = [
  // TEXT
  ShortText,
  LongText,
  RichText,
  Email,
  Phone,
  Url,
  // SELECT
  SingleSelect,
  MultiSelect,
  // NUMERIC
  Number_,
  Checkbox,
  Percentage,
  Rating,
  Slider,
  Color,
  // DATE & TIME
  Date_,
  DateTime,
  Duration,
  // FILE
  Image_,
  File_,
  // CONNECTION
  Connector,
  SubTable,
  ConnectTable,
  ConnectService,
  // CODE
  Json,
  Code,
  // CLOUD FUNCTION
  Action,
  Derivative,
  // Aggregate,
  Status,
  // AUDITING
  CreatedBy,
  UpdatedBy,
  CreatedAt,
  UpdatedAt,
  // METADATA
  User,
  Id,
];

/**
 * Returns specific property of field config
 * @param fieldType
 */
export const getFieldProp = (
  prop: keyof IFieldConfig,
  fieldType: FieldType
) => {
  const field = _find(FIELDS, { type: fieldType });
  return _get(field, prop);
};

/**
 * Returns `true` if it receives an existing fieldType
 * @param fieldType
 */
export const isFieldType = (fieldType: any) => {
  const fieldTypes = FIELDS.map((field) => field.type);
  return fieldTypes.includes(fieldType);
};

/**
 * Returns array of fieldTypes with dataType included dataTypes array
 * @param dataTypes
 */
export const hasDataTypes = (dataTypes: string[]) => {
  const fieldTypes = FIELDS.map((field) => field.type);
  return fieldTypes.filter((fieldType) =>
    dataTypes.includes(getFieldProp("dataType", fieldType))
  );
};

export const getColumnType = (column: {
  type: FieldType;
  config: {
    renderFieldType: FieldType;
  };
}) =>
  column.type === FieldType.derivative
    ? column.config.renderFieldType
    : column.type;
