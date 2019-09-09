import { useEffect } from "react";
import useDoc from "./useDoc";

const useSettings = () => {
  const [settingsState, documentDispatch] = useDoc({
    path: "_FIRETABLE_/settings"
  });
  useEffect(() => {
    const { doc, tables } = settingsState;
    if (doc && tables !== doc.tables) {
      documentDispatch({ tables: doc.tables });
    }
  }, [settingsState]);

  return settingsState;
};

export default useSettings;
