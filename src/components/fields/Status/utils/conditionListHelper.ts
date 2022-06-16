// TODO: types
export function createValueLabel(condition: any) {
  const { operator, type, value } = condition || {};
  const typeLabelMap = new Map([
    ["undefined", `${type}`],
    ["null", `${type}`],
    ["number", ` ${type}:${operator}${value}`],
    ["boolean", `${type}:${value}`],
  ]);
  const string = typeLabelMap.get(type);
  const validString = Boolean(typeof string === "string");
  return validString ? string : JSON.stringify(value);
}
