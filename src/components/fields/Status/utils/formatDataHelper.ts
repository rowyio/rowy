/**
 * We have to format data value because,
 * duplicate field types with same { name: [value]}  does something to validation
 * we have to name values to booleanValue, stringValue, numberValue to get validation to work
 */
export function formatDataValues(condition) {
  const { type } = condition;
  //default value of modal { value: null }, set correct value based on type
  let result = condition;
  if (type === "undefined") result = { ...condition, value: undefined };
  if (type === "null") result = { ...condition, value: null };
  if (type === "boolean" && condition.boolean)
    result = formatObjectBoolean("boolean", condition);
  if (type === "number" && condition.number)
    result = formatObject("number", condition);
  if (type === "string") result = formatObject("string", condition);

  return result;
}

function formatObject(key, object) {
  //create a copy of key:value
  const value = object[key];
  //add proper key:value
  const copy = { ...object, value };
  //delete old key
  delete copy[key];
  return copy;
}

function formatObjectBoolean(key, object) {
  //in order to display option value in MultiSelect, boolean values are displayed as strings
  const value = object[key] === "true" ? true : false;
  const copy = { ...object, value };
  delete copy[key];
  return copy;
}
