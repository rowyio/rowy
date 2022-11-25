/* eslint-disable react-hooks/exhaustive-deps */
import { useLayoutEffect } from "react";
import useState from "react-usestateref";

export function useSaveOnUnmount<T>(
  initialValue: T,
  onSave: (value: T) => void
) {
  const [localValue, setLocalValue, localValueRef] = useState(initialValue);

  useLayoutEffect(() => {
    return () => {
      onSave(localValueRef.current);
    };
  }, []);

  return [localValue, setLocalValue, localValueRef] as const;
}
export default useSaveOnUnmount;
