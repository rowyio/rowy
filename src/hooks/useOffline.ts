import { useState, useEffect } from "react";

export default function useOffline() {
  const [isOffline, setIsOffline] = useState(false);
  const handleOffline = () => setIsOffline(true);
  const handleOnline = () => setIsOffline(false);

  useEffect(() => {
    // Need to set here because the listener doesn’t fire on initial load
    setIsOffline(!window.navigator.onLine);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return isOffline;
}
