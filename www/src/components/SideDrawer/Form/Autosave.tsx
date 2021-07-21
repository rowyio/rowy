import { useEffect } from "react";
import { useDebounce } from "use-debounce";
import _isEqual from "lodash/isEqual";
import _pick from "lodash/pick";
import _pickBy from "lodash/pickBy";
import _isUndefined from "lodash/isUndefined";
import _reduce from "lodash/reduce";

import { Control, UseFormMethods, useWatch } from "react-hook-form";
import { Values } from "./utils";

import { useFiretableContext } from "contexts/FiretableContext";
import { FiretableState } from "hooks/useFiretable";

export interface IAutosaveProps
  extends Pick<UseFormMethods, "reset" | "formState"> {
  control: Control;
  docRef: firebase.default.firestore.DocumentReference;
  row: any;
}

const getEditables = (values: Values, tableState?: FiretableState) =>
  _pick(
    values,
    (tableState &&
      (Array.isArray(tableState?.columns)
        ? tableState?.columns
        : Object.values(tableState?.columns)
      ).map((c) => c.key)) ??
      []
  );

export default function Autosave({
  control,
  docRef,
  row,
  reset,
  formState,
}: IAutosaveProps) {
  const { tableState, updateCell } = useFiretableContext();

  const values = useWatch({ control });
  const [debouncedValue] = useDebounce(getEditables(values, tableState), 1000, {
    equalityFn: _isEqual,
  });

  useEffect(() => {
    if (!row || !row.ref) return;
    if (row.ref.id !== docRef.id) return;
    if (!updateCell) return;

    // Get only fields that have had their value updated by the user
    const updatedValues = _pickBy(
      _pickBy(debouncedValue, (_, key) => formState.dirtyFields[key]),
      (value, key) => !_isEqual(value, row[key])
    );
    console.log(debouncedValue, row);
    console.log(updatedValues);
    if (Object.keys(updatedValues).length === 0) return;

    // Update the document
    Object.entries(updatedValues).forEach(([key, value]) =>
      updateCell(
        row.ref,
        key,
        value,
        // After the cell is updated, set this field to be not dirty
        // so it doesn’t get updated again when a different field in the form
        // is updated + make sure the new value is kept after reset
        () => reset({ ...values, [key]: value })
      )
    );
  }, [debouncedValue]);

  return null;
}
