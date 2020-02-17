import { useEffect } from "react";
import { useDebounce } from "use-debounce";
import _isEqual from "lodash/isEqual";
import _pick from "lodash/pick";
import _omitBy from "lodash/omitBy";
import _isUndefined from "lodash/isUndefined";

import { FormikErrors } from "formik";
import { Values } from ".";

import { useAppContext } from "AppProvider";
import { useSideDrawerContext } from "contexts/sideDrawerContext";

export interface IAutosaveProps {
  values: Values;
  errors: FormikErrors<Values>;
}

export default function Autosave({ values, errors }: IAutosaveProps) {
  const { currentUser } = useAppContext();
  const { columns, selectedCell } = useSideDrawerContext();

  const getEditables = value => _pick(value, columns?.map(c => c.key) ?? []);

  const [debouncedValue] = useDebounce(getEditables(values), 1000, {
    equalityFn: _isEqual,
  });

  useEffect(() => {
    if (_isEqual(getEditables(selectedCell?.row), debouncedValue)) return;
    console.log("DEBOUNCED", debouncedValue);

    // Remove undefined value to prevent Firestore crash
    const updatedValues = _omitBy(debouncedValue, _isUndefined);

    const _ft_updatedAt = new Date();
    const _ft_updatedBy = currentUser?.uid;
    selectedCell?.row.ref.update({
      ...updatedValues,
      _ft_updatedAt,
      updatedAt: _ft_updatedAt,
      _ft_updatedBy,
      updatedBy: _ft_updatedBy,
    });
  }, [selectedCell?.row, debouncedValue]);

  return null;
}
