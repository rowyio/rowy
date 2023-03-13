import { useEffect, useRef } from "react";

// This hook is used to log changes to props in a component.
export default function useTraceUpdates(
  props: { [key: string]: any },
  printMessage: string = "Changed props:"
) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        // @ts-ignore
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log(printMessage, changedProps);
    }
    prev.current = props;
  });
}
