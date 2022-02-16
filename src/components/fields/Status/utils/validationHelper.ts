import _find from "lodash/find";
/**
 * @param index from modal conditions list, when editing a modal this is a num
 * @param value from validation, watching current field type
 * @param conditions
 * @returns true or false. TRUE, validation passes and form can submit. vice versa
 *
 */

export function setValueValidation(index, value, conditions) {
  let result;
  if (!index) result = !_find(conditions, { value: value });
  else {
    const copyConditions = [...conditions];
    copyConditions.splice(index, 1); // remove curr condition from condition list
    result = !_find(copyConditions, { value: value });
  }
  return result;
}

export function setLabelValidation(index, label, conditions) {
  let result;
  if (!index) result = !_find(conditions, { label: label });
  else {
    const copyConditions = [...conditions];
    copyConditions.splice(index, 1); // remove curr condition from condition list
    result = !_find(copyConditions, { label: label });
  }
  return result;
}

export function setBooleanValidation(index, value, conditions) {
  let result;
  const formatConditions = conditions.map((curr) => {
    return { ...curr, value: JSON.stringify(curr.value) };
  });

  if (!index) result = !_find(formatConditions, { value: value });
  else {
    //const copyConditions = [...formatConditions];
    formatConditions.splice(index, 1); // remove curr condition from condition list
    result = !_find(formatConditions, { value: value });
  }
  return result;
}

export function setDataTypeValidation(index, value, conditions) {
  let result;
  //We only care about duplicate undefined || null value
  if (value === "boolean" || value === "number" || value === "string") {
    return true;
  }

  const formatConditions = conditions.map((curr) => {
    let result;
    //cannot stringify sometime that does not exist
    if (curr.value === undefined) result = { ...curr, value: "undefined" };
    else result = { ...curr, value: JSON.stringify(curr.value) };
    return result;
  });

  if (!index) result = !_find(formatConditions, { value: value });
  else {
    //const copyConditions = [...formatConditions];
    formatConditions.splice(index, 1); // remove curr condition from condition list
    result = !_find(formatConditions, { value: value });
  }
  return result;
}
