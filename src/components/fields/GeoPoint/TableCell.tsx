import { IBasicCellProps } from "@src/components/fields/types";

export default function Duration({ value }: IBasicCellProps) {
  if (value === undefined) return null;

  if (value.latitude === undefined || value.longitude === undefined)
    throw new Error("Invalid value");
  return (
    <>
      {value.latitude},{value.longitude}
    </>
  );
}
