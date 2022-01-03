export const sanitiseValue = (value: any) => {
  if (value === undefined || value === null || value === "") return [];
  else return value as string[];
};

export const baseFunction = `const serviceFunction: ConnectService = async ({query, row, user}) => {
  // TODO: Implement your service function here
  return [];
};`;
