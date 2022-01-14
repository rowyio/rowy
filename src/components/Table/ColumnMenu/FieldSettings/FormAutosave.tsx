import { useEffect } from "react";
import { useDebounce } from "use-debounce";
import _isEqual from "lodash/isEqual";

import { Control, useWatch } from "react-hook-form";

export interface IAutosaveProps {
  control: Control;
  handleSave: (values: any) => void;
  debounce?: number;
}

export default function FormAutosave({
  control,
  handleSave,
  debounce = 1000,
}: IAutosaveProps) {
  const values = useWatch({ control });

  const [debouncedValue] = useDebounce(values, debounce, {
    equalityFn: _isEqual,
  });

  useEffect(() => {
    handleSave(debouncedValue);
  }, [debouncedValue]);

  return null;
}
