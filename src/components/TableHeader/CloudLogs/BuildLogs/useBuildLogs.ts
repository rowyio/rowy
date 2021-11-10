import { useEffect } from "react";
import useCollection from "@src/hooks/useCollection";
import { useProjectContext } from "@src/contexts/ProjectContext";

export default function useBuildLogs() {
  const { tableState } = useProjectContext();

  const functionConfigPath = tableState?.config.functionConfigPath;

  const [collectionState, collectionDispatch] = useCollection({});

  useEffect(() => {
    if (functionConfigPath) {
      const path = `${functionConfigPath}/buildLogs`;
      // console.log(path);
      collectionDispatch({
        path,
        orderBy: [{ key: "startTimeStamp", direction: "desc" }],
        limit: 30,
      });
    }
  }, [functionConfigPath]);

  const latestLog = collectionState?.documents?.[0];
  const latestStatus = latestLog?.status;

  return { collectionState, latestLog, latestStatus };
}
