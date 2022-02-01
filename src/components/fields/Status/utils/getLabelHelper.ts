import _find from "lodash/find";

type value = number | "string" | undefined | null;

interface condition {
  type: string;
  operator: string;
  label: string;
  value: value;
}

//TODO ADD TYPES
const getFalseyLabelFrom = (arr: condition[], value: string) => {
  const falseyType = (value) =>
    typeof value === "object" ? "null" : "undefined";
  const conditions = _find(arr, (c) => c.type === falseyType(value));
  return conditions?.label;
};

const getBooleanLabelFrom = (arr: condition[], value: string) => {
  const boolConditions = arr.filter((c) => c.type === "boolean");
  for (let c of boolConditions) {
    if (value === c.value) return c.label;
  }
};

/**
 * @param arr conditional array
 * @param value if value is not detected, conditional value becomes the default value
 * @returns conditional's label || undefined
 */
const getNumericLabelFrom = (arr: condition[], value: number) => {
  const numLabelFind = (v, c) => {
    const condVal = c.value;
    const operatorMap = new Map([
      ["<", v < condVal],
      [">", v > condVal],
      ["<=", v <= condVal],
      [">=", v >= condVal],
      ["==", v === condVal],
    ]);
    return operatorMap.get(c.operator) ? c.label : undefined;
  };

  const numConditions = arr.filter((c) => c?.type === "number");
  for (let c of numConditions) {
    const label = numLabelFind(value, c);
    if (typeof label === "string") return label;
  }
};

const getLabelFrom = (arr, value) => {
  const validVal = Boolean(value);
  if (!validVal) return;
  for (let c of arr) {
    if (value === c.value) return c.label;
  }
};

export default function getLabel(value, conditions) {
  let _label: any = undefined;
  const isBoolean = Boolean(typeof value === "boolean");
  const notBoolean = Boolean(typeof value !== "boolean");
  const isNullOrUndefined = Boolean(!value && notBoolean);
  const isNumeric = Boolean(typeof value === "number");

  if (isNullOrUndefined) _label = getFalseyLabelFrom(conditions, value);
  else if (isBoolean) _label = getBooleanLabelFrom(conditions, value);
  else if (isNumeric) _label = getNumericLabelFrom(conditions, value);
  else _label = getLabelFrom(conditions, value);
  return _label ?? value;
}
