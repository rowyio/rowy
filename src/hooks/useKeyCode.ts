import { useEffect, useState } from "react";
function useKeyCode(keyCode: number) {
  const [isPressed, setKeyPressed] = useState(false);
  // Only allow fetching each keypress event once to prevent infinite loops
  const clear = () => {
    if (isPressed) {
      setKeyPressed(false);
    }
  };
  useEffect(() => {
    function downHandler(event: any) {
      if (event.keyCode === keyCode) {
        setKeyPressed(true);
      }
    }
    window.addEventListener("keydown", downHandler);
    return () => window.removeEventListener("keydown", downHandler);
  }, [keyCode]);

  return { isPressed, clear };
}
export default useKeyCode;
