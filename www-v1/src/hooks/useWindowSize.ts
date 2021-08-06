import { useState, useEffect } from "react";
function useWindowSize() {
  const isClient = typeof window === "object";

  function getSize() {
    if (!isClient) return undefined;
    return { width: window.innerWidth, height: window.innerHeight };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      //return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

export default useWindowSize;
