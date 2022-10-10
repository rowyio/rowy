import { useState, useEffect } from "react";

export default function useOffline() {
  const [isOffline, setIsOffline] = useState(true);
  const handleOffline = () => setIsOffline(true);
  const handleOnline = () => setIsOffline(false);

  useEffect(() => {
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return isOffline;
}
