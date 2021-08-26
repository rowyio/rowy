// Define field type strings used in Firetable column config
export enum FieldType {
  // TEXT
  shortText = "SIMPLE_TEXT",
  longText = "LONG_TEXT",
  email = "EMAIL",
  phone = "PHONE_NUMBER",
  url = "URL",
  // NUMERIC
  checkbox = "CHECK_BOX",
  number = "NUMBER",
  percentage = "PERCENTAGE",
  rating = "RATING",
  slider = "SLIDER",
  color = "COLOR",
  // DATE & TIME
  date = "DATE",
  dateTime = "DATE_TIME",
  duration = "DURATION",
  // FILE
  image = "IMAGE",
  file = "FILE",
  // SELECT
  singleSelect = "SINGLE_SELECT",
  multiSelect = "MULTI_SELECT",
  // CONNECTION
  subTable = "SUB_TABLE",
  connectTable = "DOCUMENT_SELECT",
  connectService = "SERVICE_SELECT",
  // CODE
  json = "JSON",
  code = "CODE",
  richText = "RICH_TEXT",
  // CLOUD FUNCTION
  action = "ACTION",
  derivative = "DERIVATIVE",
  aggregate = "AGGREGATE",
  // FIRETABLE
  user = "USER",
  id = "ID",
  last = "LAST",
  status = "STATUS",
}
