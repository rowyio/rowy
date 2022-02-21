export function setDefaultValue(
  defaultValue: string | number,
  type: string,
  conditions?: [{ [key: string]: any }] | undefined,
  index?: number
) {
  if (typeof index !== "number") return defaultValue;
  /**
   *  Firebase stores value as number, undefined, and null
   *  In order for Form Builder' Field Type to display value, format data values into strings
   */
  const formatConditions = conditions?.map((curr) => {
    let result;
    //cannot stringify sometime that does not exist
    if (curr.type === "undefined") result = { ...curr, value: "undefined" };
    if (curr.type === "null") result = { ...curr, value: "null" };
    if (curr.type === "boolean")
      result = { ...curr, value: curr.value === "true" ? true : false };
    else result = { ...curr };
    return result;
  });
  const editCondition = formatConditions?.[index];
  const fieldTypeValue = editCondition[type];
  return fieldTypeValue;
}
