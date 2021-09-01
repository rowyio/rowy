import hotkeys, { HotkeysEvent } from "hotkeys-js";
import { useCallback, useEffect } from "react";

type CallbackFn = (event: KeyboardEvent, handler: HotkeysEvent) => void;
/**
 * used for listening for keyboard shortcuts
 * @param keys
 * @param callback
 * @param deps
 */
export default function useHotkeys(
  keys: string,
  callback: CallbackFn,
  deps: any[] = []
) {
  const memoisedCallback = useCallback(callback, deps);

  useEffect(() => {
    hotkeys(keys, memoisedCallback);

    return () => hotkeys.unbind(keys, memoisedCallback);
  }, [memoisedCallback]);
}
