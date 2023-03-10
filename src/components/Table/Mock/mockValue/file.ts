export const fileValueConverter = (value: any) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value.split(",").map((url) => ({
      downloadURL: url.trim(),
      name: +new Date() + "-" + Math.round(Math.random() * 1000),
    }));
  }
  return [];
};
