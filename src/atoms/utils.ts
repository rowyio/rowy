import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { useAtomsDebugValue } from "jotai/devtools";
import useMemoValue from "use-memo-value";
import { isEqual } from "lodash-es";

export function DebugAtoms(
  options: NonNullable<Parameters<typeof useAtomsDebugValue>[0]>
) {
  useAtomsDebugValue(options);
  return null;
}

/**
 * Sets an atom’s value when the `value` prop changes.
 * Useful when setting an atom’s initialValue and you want to keep it in sync.
 */
export function SyncAtomValue<T>({
  atom,
  scope,
  value,
}: {
  atom: Parameters<typeof useSetAtom>[0];
  scope: Parameters<typeof useSetAtom>[1];
  value: T;
}) {
  const memoized = useMemoValue(value, isEqual);
  const setAtom = useSetAtom(atom, scope);

  useEffect(() => {
    setAtom(memoized);
  }, [setAtom, memoized]);

  return null;
}
