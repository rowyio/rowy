// Define field type strings used in column config
export enum FieldType {
  // TEXT
  shortText = "SIMPLE_TEXT",
  longText = "LONG_TEXT",
  richText = "RICH_TEXT",
  email = "EMAIL",
  phone = "PHONE_NUMBER",
  url = "URL",
  // SELECT
  singleSelect = "SINGLE_SELECT",
  multiSelect = "MULTI_SELECT",
  // NUMERIC
  checkbox = "CHECK_BOX",
  number = "NUMBER",
  percentage = "PERCENTAGE",
  rating = "RATING",
  slider = "SLIDER",
  color = "COLOR",
  geoPoint = "GEO_POINT",
  // DATE & TIME
  date = "DATE",
  dateTime = "DATE_TIME",
  duration = "DURATION",
  // FILE
  image = "IMAGE",
  file = "FILE",
  // CONNECTION
  connector = "CONNECTOR",
  subTable = "SUB_TABLE",
  arraySubTable = "ARRAY_SUB_TABLE",
  reference = "REFERENCE",
  connectTable = "DOCUMENT_SELECT",
  connectService = "SERVICE_SELECT",
  // CODE
  json = "JSON",
  code = "CODE",
  markdown = "MARKDOWN",
  array = "ARRAY",
  // CLOUD FUNCTION
  action = "ACTION",
  derivative = "DERIVATIVE",
  aggregate = "AGGREGATE",
  status = "STATUS",
  // CLIENT FUNCTION
  formula = "FORMULA",
  // AUDIT
  createdBy = "CREATED_BY",
  updatedBy = "UPDATED_BY",
  createdAt = "CREATED_AT",
  updatedAt = "UPDATED_AT",
  // METADATA
  user = "USER",
  id = "ID",
  last = "LAST",
}
