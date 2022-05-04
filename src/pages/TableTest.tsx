import { Suspense } from "react";
import { useAtom, Provider } from "jotai";
import { useParams } from "react-router-dom";

import {
  tableScope,
  tableIdAtom,
  tableSettingsAtom,
  tableSchemaAtom,
} from "@src/atoms/tableScope";

import TableSourceFirestore from "@src/sources/TableSourceFirestore";
import TableHeaderSkeleton from "@src/components/Table/Skeleton/TableHeaderSkeleton";
import HeaderRowSkeleton from "@src/components/Table/Skeleton/HeaderRowSkeleton";

function TableTestPage() {
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);

  return (
    <div>
      <p>Table ID: {tableId}</p>

      <pre>{JSON.stringify(tableSettings, undefined, 2)}</pre>
      <pre>{JSON.stringify(tableSchema, undefined, 2)}</pre>
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
