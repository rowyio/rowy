export const sanitiseValue = (value: any) => {
  if (value === undefined || value === null || value === "") return null;
  else if (Array.isArray(value)) return value[0] as string;
  else return value as string;
};
