import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import _pickBy from "lodash/pickBy";
import _isEqual from "lodash/isEqual";

import { Values } from "./utils";

export interface IResetProps {
  defaultValues: Values;
  dirtyFields: UseFormReturn["formState"]["dirtyFields"];
  reset: UseFormReturn["reset"];
  getValues: UseFormReturn["getValues"];
}

/**
 * Reset the form’s values and errors when the Firestore doc’s data updates
 */
export default function Reset({
  defaultValues,
  dirtyFields,
  reset,
  getValues,
}: IResetProps) {
  useEffect(
    () => {
      const resetValues = { ...defaultValues };
      const currentValues = getValues();

      // If the field is dirty, (i.e. the user input a value but it hasn’t been)
      // saved to the db yet, keep its current value and keep it marked as dirty
      for (const [field, isDirty] of Object.entries(dirtyFields)) {
        if (isDirty) {
          resetValues[field] = currentValues[field];
        }
      }

      // Compare currentValues to resetValues
      const diff = _pickBy(getValues(), (v, k) => !_isEqual(v, resetValues[k]));
      // Reset if needed & keep the current dirty fields
      if (Object.keys(diff).length > 0) {
        reset(resetValues, { keepDirty: true });
      }
    },
    // `defaultValues` is the `initialValue` of each field type +
    // the current value in the Firestore doc
    [JSON.stringify(defaultValues)]
  );

  return null;
}
