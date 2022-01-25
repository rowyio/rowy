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
    const val = Number(v); // need to handle when value is default seted
    const condVal: number = Number(c.value);
    const operatorMap = new Map([
      ["==", val === condVal ? true : false],
      ["<", val < condVal ? true : false],
      ["<=", val <= condVal ? true : false], // will never reach this point
      [">", val > condVal ? true : false],
      [">=", val >= condVal ? true : false],
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
  const invalidVal = Boolean(value);
  if (invalidVal) return;
  for (let c of arr) {
    if (value === c.value) return c.label;
  }
};

const finalLabel = (label: string | undefined, value) => {
  return typeof label === "string" ? label : value;
};

export default function getLabel(value, conditions) {
  let _label: any = undefined;
  const isBoolean = Boolean(typeof value === "boolean");
  const notBoolean = Boolean(typeof value !== "boolean");
  const isNullOrUndefined = Boolean(!value && notBoolean);
  const isNumeric = Boolean(typeof value === "number" || Number(value)); //currently this is hacky. we need to make sure types are being saved correctly. numbers are being save as number

  if (isNullOrUndefined) _label = getFalseyLabelFrom(conditions, value);
  else if (isBoolean) _label = getBooleanLabelFrom(conditions, value);
  else if (isNumeric) _label = getNumericLabelFrom(conditions, value);
  else _label = getLabelFrom(conditions, value);
  return finalLabel(_label, value);
}
