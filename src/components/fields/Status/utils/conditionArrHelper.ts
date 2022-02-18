export function createConditionsArr(newCondition, conditions) {
  let result;
  const noConditions = Boolean(conditions?.length === 0 || !conditions);
  if (noConditions) result = [newCondition];
  else result = [...conditions, newCondition];
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
