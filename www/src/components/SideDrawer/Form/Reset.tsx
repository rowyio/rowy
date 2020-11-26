import React, { useEffect } from "react";
import { UseFormMethods } from "react-hook-form";

import { Values } from "./utils";

export interface IResetProps
  extends Pick<UseFormMethods, "formState" | "reset" | "getValues"> {
  defaultValues: Values;
}

export default function Reset({
  defaultValues,
  formState,
  reset,
  getValues,
}: IResetProps) {
  useEffect(() => {
    const resetValues = { ...defaultValues };
    for (const [field, isDirty] of Object.entries(formState.dirtyFields)) {
      if (isDirty) {
        console.log(field, resetValues[field], getValues(field));
        resetValues[field] = getValues(field);
      }
    }
    reset(resetValues, { isDirty: true, dirtyFields: true });
  }, [JSON.stringify(defaultValues)]);

  return null;
}
