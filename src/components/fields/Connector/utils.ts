import { replacer } from "@src/utils/fns";
import _get from "lodash/get";
export const sanitiseValue = (value: any) => {
  if (value === undefined || value === null || value === "") return [];
  else return value as string[];
};

export const baseFunction = `const connectorFn: Connector = async ({query, row, user}) => {
  // TODO: Implement your service function here
  return [];
};`;

export const getLabel = (config, row) => {
  if (!config.labelFormatter) {
    return `⚠️ needs configuration`;
  } else if (config.labelFormatter.includes("{{")) {
    return config.labelFormatter.replace(/\{\{(.*?)\}\}/g, replacer(row));
  } else {
    return _get(row, config.labelFormatter);
  }
};
