import {
  MutableRefObject,
  useCallback,
  useRef,
  useSyncExternalStore,
} from "react";

// NOTE: This is not the final solution. But is a potential solution for this problem.
export default function useStateWithRef<T>(
  initialState: T
): [T, (newValue: T) => void, MutableRefObject<T>] {
  const value = useRef<T>(initialState);
  const get = useCallback(() => value.current, []);
  const subscribers = useRef(new Set<() => void>());

  const set = useCallback((newValue: T) => {
    value.current = newValue;
    subscribers.current.forEach((callback) => callback());
  }, []);

  const subscribe = useCallback((callback: () => void) => {
    subscribers.current.add(callback);
    return () => subscribers.current.delete(callback);
  }, []);

  const state = useSyncExternalStore(subscribe, get);

  return [state, set, value];
}
