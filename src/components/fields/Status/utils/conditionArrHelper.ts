import { QrCodeScannerOutlined } from "@mui/icons-material";

export default function createConditionsArr(newCondition, conditions) {
  let result;
  const noConditions = Boolean(conditions?.length === 0 || !conditions);
  const formatNewCondition = setFalseyValue(newCondition.type, newCondition);
  if (noConditions) result = [formatNewCondition];
  else result = [...conditions, formatNewCondition];
  return result;
}

function setFalseyValue(type, condition) {
  //default value of modal { value: null }, set correct value based on type
  let result = condition;
  if (type === "undefined") result = { ...condition, value: undefined };
  if (type === "boolean" && typeof condition.value === "object")
    result = { ...condition, value: false };
  return result;
}

export function updateCondition(condition, conditions, index) {
  const arr = [...conditions];
  arr.splice(index, 1, condition);
  return arr;
}

export function removeCondition(removeIndex, conditions) {
  return conditions.filter((c, index) => index !== removeIndex);
}
