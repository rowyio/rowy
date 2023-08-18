import { Suspense } from "react";
import { useAtom, useSetAtom, Provider } from "jotai";
import { useParams } from "react-router-dom";

import {
  tableScope,
  tableIdAtom,
  tableSettingsAtom,
  tableSchemaAtom,
  tableFiltersAtom,
  tableSortsAtom,
  tableRowsAtom,
  auditChangeAtom,
} from "@src/atoms/tableScope";

import TableSourceFirestore from "@src/sources/TableSourceFirestore";
import TableToolbarSkeleton from "@src/components/TableToolbar/TableToolbarSkeleton";
import TableSkeleton from "@src/components/Table/TableSkeleton";

import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import { currentUserAtom, projectScope } from "@src/atoms/projectScope";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { TABLE_SCHEMAS } from "@src/config/dbPaths";
import { generateId } from "@src/utils/table";

function TableTestPage() {
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);

  const setTableFilters = useSetAtom(tableFiltersAtom, tableScope);
  const setTableSorts = useSetAtom(tableSortsAtom, tableScope);

  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const [auditChange] = useAtom(auditChangeAtom, tableScope);

  console.log(tableId, tableSettings, tableSchema);

  const [firebaseDb] = useAtom(firebaseDbAtom, projectScope);

  return (
    <div>
      <p>
        Table ID: <code>{tableId}</code>
      </p>

      <pre style={{ height: "4em", overflow: "auto", resize: "vertical" }}>
        tableSettings: {JSON.stringify(tableSettings, undefined, 2)}
      </pre>
      <pre style={{ height: "4em", overflow: "auto", resize: "vertical" }}>
        tableSchema: {JSON.stringify(tableSchema, undefined, 2)}
      </pre>

      <button
        onClick={() => {
          setDoc(
            doc(firebaseDb, TABLE_SCHEMAS, tableId!),
            {
              _test: { [Date.now()]: "write" },
              _testArray: [{ [Date.now()]: "writeArray" }],
            },
            { merge: true }
          );
        }}
      >
        Firestore set + merge
      </button>
      <button
        onClick={() => {
          updateDoc(doc(firebaseDb, TABLE_SCHEMAS, tableId!), {
            _test: { [Date.now()]: "write" },
            _testArray: [{ [Date.now()]: "writeArray" }],
          });
        }}
      >
        Firestore update
      </button>
      <br />

      <button
        onClick={() =>
          setTableFilters([
            {
              key: "signedUp",
              operator: "==",
              value: true,
              id: generateId(),
            },
          ])
        }
      >
        Set table filters
      </button>
      <button onClick={() => setTableFilters([])}>Clear table filters</button>

      <button
        onClick={() => setTableSorts([{ key: "firstName", direction: "asc" }])}
      >
        Set table sorts
      </button>
      <button onClick={() => setTableFilters([])}>Clear table sorts</button>

      <ol>
        {tableRows.map(({ _rowy_ref, ...data }) => (
          <li key={_rowy_ref.id}>
            {_rowy_ref.id}: {data.firstName} {data.signedUp.toString()}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function ProvidedTableTestPage() {
  const { id } = useParams();
  const [currentUser] = useAtom(currentUserAtom, projectScope);

  return (
    <Suspense
      fallback={
        <>
          <TableToolbarSkeleton />
          <TableSkeleton />
        </>
      }
    >
      <Provider
        key={id}
        scope={tableScope}
        initialValues={[
          [tableIdAtom, id],
          [currentUserAtom, currentUser],
        ]}
      >
        <TableSourceFirestore />
        <TableTestPage />
      </Provider>
    </Suspense>
  );
}
