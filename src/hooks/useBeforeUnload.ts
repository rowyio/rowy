import { useEffect } from "react";
import { useAtom, Atom } from "jotai";

function beforeUnloadHandler(event: BeforeUnloadEvent) {
  event.preventDefault();
  return (event.returnValue =
    "Are you sure you want to leave? You may have unsaved changes.");
}

/**
 * Displays an alert when the user tries to leave the page
 * while the atom value is not falsy
 * @param atom - The atom’s value to listen to
 * @param scope - The atom scope
 */
export default function useBeforeUnload(
  atom: Atom<any | null>,
  scope: NonNullable<Parameters<typeof useAtom>[1]>
) {
  const [atomValue] = useAtom(atom, scope);

  const atomValueFalsy = !atomValue;
  useEffect(() => {
    if (atomValueFalsy)
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    else window.addEventListener("beforeunload", beforeUnloadHandler);
  }, [atomValueFalsy]);

  return !atomValueFalsy;
}
