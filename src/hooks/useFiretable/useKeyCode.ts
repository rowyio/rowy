import { useEffect, useState } from "react";
function useKeyCode(keyCode: number) {
  const [isKeyPressed, setKeyPressed] = useState(false);
  // Only allow fetching each keypress event once to prevent infinite loops
  const clear = () => {
    if (isKeyPressed) {
      setKeyPressed(false);
    }
  };
  clear();
  useEffect(() => {
    function downHandler(event: any) {
      if (event.keyCode === keyCode) {
        setKeyPressed(true);
      }
    }
    window.addEventListener("keydown", downHandler);
    return () => window.removeEventListener("keydown", downHandler);
  }, [keyCode]);

  return isKeyPressed;
}
export default useKeyCode;
