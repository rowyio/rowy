import { SWRConfig } from "swr";

// NOTE: This does not support React 18 yet. See: https://github.com/vercel/swr/issues/1904

// https://swr.vercel.app/docs/advanced/cache#localstorage-based-persistent-cache
function localStorageProvider() {
  // When initializing, we restore the data from `localStorage` into a map.
  const map = new Map(JSON.parse(localStorage.getItem("swr-cache") || "[]"));

  // Before unloading the app, we write back all the data into `localStorage`.
  window.addEventListener("beforeunload", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem("swr-cache", appCache);
  });

  // We still use the map for write & read for performance.
  return map;
}

export default function SwrProvider({ children }: React.PropsWithChildren<{}>) {
  return (
    <SWRConfig value={{ provider: localStorageProvider }}>{children}</SWRConfig>
  );
}
