export const sanitiseValue = (value: any) => {
  if (value === undefined || value === null || value === "") return [];
  else return value as string[];
};
