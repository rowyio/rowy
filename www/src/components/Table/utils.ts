import _get from "lodash/get";
export const getCellValue = (row, key) => {
  if (key.includes(".")) return _get(row, key);
  return row[key];
};
