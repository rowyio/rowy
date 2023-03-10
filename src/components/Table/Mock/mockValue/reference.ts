export const referenceValueConverter = (value: any) => {
  if (typeof value === "string") {
    if (
      value !== "" &&
      value.split("/").length > 0 &&
      value.split("/").length % 2 === 0
    ) {
      return { path: value };
    }
  }
  return value;
};
