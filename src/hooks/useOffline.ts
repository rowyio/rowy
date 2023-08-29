import { useState, useEffect } from "react";

export default function useOffline() {
  const [isOffline, setIsOffline] = useState(false);
  const handleOffline = () => setIsOffline(true);
  const handleOnline = () => setIsOffline(false);

  const checkOnlineStatus = async () => {
    try {
      const res = await fetch("https://httpbin.org/get", { cache: "no-store" });
      if (res.status >= 200 && res.status < 300) {
        handleOnline();
      } else {
        handleOffline();
      }
    } catch (error) {
      handleOffline();
    }
  };
  useEffect(() => {
    // Need to set here because the listener doesn’t fire on initial load
    setIsOffline(!window.navigator.onLine);
    if (!window.navigator.onLine) {
      checkOnlineStatus();
    }
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return isOffline;
}
