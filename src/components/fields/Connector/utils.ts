import { TableRow } from "@src/types/table";
import { get } from "lodash-es";
export const sanitiseValue = (value: any) => {
  if (value === undefined || value === null || value === "") return [];
  else return value as string[];
};

export const replacer = (data: any) => (m: string, key: string) => {
  const objKey = key.split(":")[0];
  const defaultValue = key.split(":")[1] || "";
  return get(data, objKey, defaultValue);
};

export const baseFunction = `// Import any NPM package needed
// import _ from "lodash";

const connector: Connector = async ({ query, row, user, logging }) => {
  logging.log("connector started");
  // return [
  //   { id: "a", name: "Apple" },
  //   { id: "b", name: "Banana" },
  // ];
};

export default connector;
`;

export const getLabel = (config: any, row: TableRow) => {
  if (!config.labelFormatter) {
    return `⚠️ needs configuration`;
  } else if (config.labelFormatter.includes("{{")) {
    return config.labelFormatter.replace(/\{\{(.*?)\}\}/g, replacer(row));
  } else {
    return get(row, config.labelFormatter);
  }
};
