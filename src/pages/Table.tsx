import { Suspense } from "react";
import { useAtom, Provider } from "jotai";
import { useParams } from "react-router-dom";
import { isEmpty } from "lodash-es";

import { Fade } from "@mui/material";

import TableToolbarSkeleton from "@src/components/TableToolbar/TableToolbarSkeleton";
import HeaderRowSkeleton from "@src/components/Table/HeaderRowSkeleton";
import EmptyTable from "@src/components/Table/EmptyTable";
import Table from "@src/components/Table";

import { currentUserAtom, globalScope } from "@src/atoms/globalScope";
import TableSourceFirestore from "@src/sources/TableSourceFirestore";
import {
  tableScope,
  tableIdAtom,
  tableSettingsAtom,
  tableSchemaAtom,
} from "@src/atoms/tableScope";
import ActionParamsProvider from "@src/components/fields/Action/FormDialog/Provider";

function TablePage() {
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);

  console.log(tableSchema);

  if (isEmpty(tableSchema.columns))
    return (
      <Fade style={{ transitionDelay: "500ms" }}>
        <div>
          <EmptyTable />
        </div>
      </Fade>
    );

  return (
    // <Suspense fallback={<div>Loading rows…</div>}>
    <ActionParamsProvider>
      <Table />
    </ActionParamsProvider>
    // </Suspense>
  );
}

export default function ProvidedTablePage() {
  const { id } = useParams();
  const [currentUser] = useAtom(currentUserAtom, globalScope);

  return (
    <Suspense
      fallback={
        <>
          <TableToolbarSkeleton />
          <HeaderRowSkeleton />
        </>
      }
    >
      <Provider
        key={tableScope.description + "/" + id}
        scope={tableScope}
        initialValues={[
          [tableIdAtom, id],
          [currentUserAtom, currentUser],
        ]}
      >
        <TableSourceFirestore />
        <TablePage />
      </Provider>
    </Suspense>
  );
}
