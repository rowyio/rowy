import { Suspense } from "react";
import { useAtom, useSetAtom, Provider } from "jotai";
import { useParams } from "react-router-dom";

import {
  tableScope,
  tableIdAtom,
  tableSettingsAtom,
  tableSchemaAtom,
  tableFiltersAtom,
  tableOrdersAtom,
  tableRowsAtom,
} from "@src/atoms/tableScope";

import TableSourceFirestore from "@src/sources/TableSourceFirestore";
import TableHeaderSkeleton from "@src/components/Table/Skeleton/TableHeaderSkeleton";
import HeaderRowSkeleton from "@src/components/Table/Skeleton/HeaderRowSkeleton";

function TableTestPage() {
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);

  const setTableFilters = useSetAtom(tableFiltersAtom, tableScope);
  const setTableOrders = useSetAtom(tableOrdersAtom, tableScope);

  const [tableRows] = useAtom(tableRowsAtom, tableScope);

  console.log(tableId, tableSchema);

  return (
    <div>
      <p>
        Table ID: <code>{tableId}</code>
      </p>

      <pre style={{ height: "4em", overflow: "auto" }}>
        tableSettings: {JSON.stringify(tableSettings, undefined, 2)}
      </pre>
      <pre style={{ height: "4em", overflow: "auto" }}>
        tableSchema: {JSON.stringify(tableSchema, undefined, 2)}
      </pre>

      <button
        onClick={() =>
          setTableFilters([{ key: "signedUp", operator: "==", value: true }])
        }
      >
        Set table filters
      </button>
      <button onClick={() => setTableFilters([])}>Clear table filters</button>

      <button
        onClick={() => setTableOrders([{ key: "firstName", direction: "asc" }])}
      >
        Set table orders
      </button>
      <button onClick={() => setTableFilters([])}>Clear table orders</button>

      <ol>
        {tableRows.map(({ _rowy_id, ...data }) => (
          <li key={_rowy_id}>
            {_rowy_id}: {data.firstName} {data.signedUp.toString()}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function ProvidedTableTestPage() {
  const { id } = useParams();

  return (
    <Suspense
      fallback={
        <>
          <TableHeaderSkeleton />
          <HeaderRowSkeleton />
        </>
      }
    >
      <Provider key={id} scope={tableScope} initialValues={[[tableIdAtom, id]]}>
        <TableSourceFirestore />
        <TableTestPage />
      </Provider>
    </Suspense>
  );
}
