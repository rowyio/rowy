import { Scope } from "jotai/core/atom";
import { useAtomsDebugValue } from "jotai/devtools";

export function DebugAtoms(
  options: { scope: Scope } & Parameters<typeof useAtomsDebugValue>[0]
) {
  useAtomsDebugValue(options);
  return null;
}
