export function setDefaultValue(
  defaultValue: any,
  type: any,
  conditions: any,
  index: any
) {
  if (!index) return defaultValue;
  const editCondition = conditions[index];
  const fieldTypeValue = editCondition[type];
  return fieldTypeValue;
}
