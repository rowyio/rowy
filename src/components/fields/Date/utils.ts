export const transformValue = (value: any): Date | null => {
  if (typeof value === "number") return new Date(value);
  if (value && "toDate" in value) return value.toDate();
  if (value !== undefined) return value;
  return null;
};

export const sanitizeValue = (value: Date | null) => {
  if (isNaN(value?.valueOf() ?? 0)) return undefined;
  return value;
};
