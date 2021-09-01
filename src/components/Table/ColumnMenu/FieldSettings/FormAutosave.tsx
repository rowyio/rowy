import { useEffect } from "react";
import { useDebounce } from "use-debounce";
import _isEqual from "lodash/isEqual";

import { Control, useWatch } from "react-hook-form";

export interface IAutosaveProps {
  control: Control;
  handleSave: (values: any) => void;
}

export default function FormAutosave({ control, handleSave }: IAutosaveProps) {
  const values = useWatch({ control });

  const [debouncedValue] = useDebounce(values, 1000, {
    equalityFn: _isEqual,
  });

  useEffect(() => {
    handleSave(debouncedValue);
  }, [debouncedValue]);

  return null;
}
