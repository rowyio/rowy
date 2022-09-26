import { useAtomsDebugValue } from "jotai/devtools";

export function DebugAtoms(
  options: NonNullable<Parameters<typeof useAtomsDebugValue>[0]>
) {
  useAtomsDebugValue(options);
  return null;
}
