import _find from "lodash/find";
import _get from "lodash/get";

import { FieldType } from "constants/fields";
import { IFieldConfig } from "./types";

// Import field configs
import ShortText from "./ShortText";
import LongText from "./LongText";
import Email from "./Email";
import Phone from "./Phone";
import Url from "./Url";
import Checkbox from "./Checkbox";
import Number_ from "./Number";
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
import RichText from "./RichText";
import Action from "./Action";
import Derivative from "./Derivative";
import Aggregate from "./Aggregate";
import User from "./User";
import Id from "./Id";
import Status from "./Status";

// Export field configs in order for FieldsDropdown
export const FIELDS: IFieldConfig[] = [
  // TEXT
  ShortText,
  LongText,
  Email,
  Phone,
  Url,
  // NUMERIC
  Checkbox,
  Number_,
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
  // SELECT
  SingleSelect,
  MultiSelect,
  // CONNECTION
  SubTable,
  ConnectTable,
  ConnectService,
  // CODE
  Json,
  Code,
  RichText,
  // CLOUD FUNCTION
  Action,
  Derivative,
  Aggregate,
  // FIRETABLE
  User,
  Id,
  Status,
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
