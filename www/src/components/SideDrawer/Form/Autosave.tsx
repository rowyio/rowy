import { useEffect } from "react";
import { useDebounce } from "use-debounce";
import _isEqual from "lodash/isEqual";
import _pick from "lodash/pick";
import _omitBy from "lodash/omitBy";
import _isUndefined from "lodash/isUndefined";
import _reduce from "lodash/reduce";

import { Control, useWatch } from "react-hook-form";
import { Values } from "./utils";

import { useAppContext } from "contexts/appContext";
import { useFiretableContext, firetableUser } from "contexts/firetableContext";

export interface IAutosaveProps {
  control: Control;
  defaultValues: Values;
  docRef: firebase.firestore.DocumentReference;
  row: any;
}

export default function Autosave({
  control,
  defaultValues,
  docRef,
  row,
}: IAutosaveProps) {
  const { currentUser } = useAppContext();
  const { tableState } = useFiretableContext();

  const values = useWatch({ control });

  const getEditables = (value) =>
    _pick(
      value,
      (tableState &&
        (Array.isArray(tableState?.columns)
          ? tableState?.columns
          : Object.values(tableState?.columns)
        ).map((c) => c.key)) ??
        []
    );

  const [debouncedValue] = useDebounce(getEditables(values), 1000, {
    equalityFn: _isEqual,
  });

  useEffect(() => {
    if (!row || !row.ref) return;
    if (row.ref.id !== docRef.id) return;

    // Get only fields that have changed and
    // Remove undefined value to prevent Firestore crash
    const updatedValues = _omitBy(
      _omitBy(debouncedValue, _isUndefined),
      (value, key) => _isEqual(value, row[key])
    );

    if (Object.keys(updatedValues).length === 0) return;

    const _ft_updatedAt = new Date();
    const _ft_updatedBy = firetableUser(currentUser);
    row.ref
      .update({
        ...updatedValues,
        _ft_updatedAt,
        updatedAt: _ft_updatedAt,
        _ft_updatedBy,
        updatedBy: _ft_updatedBy,
      })
      .then(() => console.log("Updated row", row.ref.id, updatedValues));
  }, [debouncedValue]);

  return null;
}
