import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import useMemoValue from "use-memo-value";
import {
  query,
  collection,
  orderBy,
  limit,
  queryEqual,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";

import { projectScope } from "@src/atoms/projectScope";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import { tableScope, tableSchemaAtom } from "@src/atoms/tableScope";

export default function useBuildLogs() {
  const [firebaseDb] = useAtom(firebaseDbAtom, projectScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const functionConfigPath = tableSchema.functionConfigPath;

  const [logs, setLogs] = useState<DocumentData[]>([]);
  const logsQuery = useMemoValue(
    functionConfigPath
      ? query(
          collection(firebaseDb, `${functionConfigPath}/buildLogs`),
          orderBy("startTimeStamp", "desc"),
          limit(15)
        )
      : null,
    (next, prev) => queryEqual(next as any, prev as any)
  );

  useEffect(() => {
    if (!logsQuery) return;

    const unsubscribe = onSnapshot(logsQuery, (snapshot) => {
      setLogs(snapshot.docs.map((doc) => doc.data()));
    });

    return unsubscribe;
  }, [logsQuery]);

  const latestLog = logs[0];
  const latestStatus = latestLog?.status as string;
  return { logs, latestLog, latestStatus };
}
