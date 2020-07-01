import { useEffect } from "react";
import { useDebounce } from "use-debounce";
import _isEqual from "lodash/isEqual";
import _pick from "lodash/pick";
import _omitBy from "lodash/omitBy";
import _isUndefined from "lodash/isUndefined";

import { FormikErrors } from "formik";
import { Values } from ".";

import { useAppContext } from "contexts/appContext";
import { useFiretableContext, firetableUser } from "contexts/firetableContext";

export interface IAutosaveProps {
  values: Values;
  errors: FormikErrors<Values>;
}

export default function Autosave({ values, errors }: IAutosaveProps) {
  const { currentUser } = useAppContext();
  const { tableState, sideDrawerRef } = useFiretableContext();

  const getEditables = value =>
    _pick(value, tableState?.columns?.map(c => c.key) ?? []);

  const [debouncedValue] = useDebounce(getEditables(values), 1000, {
    equalityFn: _isEqual,
  });

  const row = sideDrawerRef?.current?.cell
    ? tableState?.rows[sideDrawerRef?.current?.cell.row]
    : {};

  useEffect(() => {
    if (!row || !row.ref) return;
    if (_isEqual(getEditables(row), debouncedValue)) return;
    if (row.ref.id !== values.ref.id) return;

    // Remove undefined value to prevent Firestore crash
    const updatedValues = _omitBy(debouncedValue, _isUndefined);

    const _ft_updatedAt = new Date();
    const _ft_updatedBy = firetableUser(currentUser);
    row.ref.update({
      ...updatedValues,
      _ft_updatedAt,
      updatedAt: _ft_updatedAt,
      _ft_updatedBy,
      updatedBy: _ft_updatedBy,
    });
  }, [debouncedValue]);

  return null;
}
