import { Suspense } from "react";
import { useAtom, Provider } from "jotai";
import { useParams } from "react-router-dom";
import { isEmpty } from "lodash-es";

import { Fade } from "@mui/material";

import TableToolbarSkeleton from "@src/components/TableToolbar/TableToolbarSkeleton";
import HeaderRowSkeleton from "@src/components/Table/HeaderRowSkeleton";
import EmptyTable from "@src/components/Table/EmptyTable";
import TableToolbar from "@src/components/TableToolbar";
import Table from "@src/components/Table";
import ColumnMenu from "@src/components/ColumnMenu";
import ColumnModals from "@src/components/ColumnModals";

import { currentUserAtom, globalScope } from "@src/atoms/globalScope";
import TableSourceFirestore from "@src/sources/TableSourceFirestore";
import {
  tableScope,
  tableIdAtom,
  // tableSettingsAtom,
  tableSchemaAtom,
} from "@src/atoms/tableScope";
import ActionParamsProvider from "@src/components/fields/Action/FormDialog/Provider";

function TablePage() {
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);

  if (isEmpty(tableSchema.columns))
    return (
      <Fade style={{ transitionDelay: "500ms" }}>
        <div>
          <EmptyTable />
        </div>
      </Fade>
    );

  return (
    <ActionParamsProvider>
      <Suspense fallback={<TableToolbarSkeleton />}>
        <TableToolbar />
      </Suspense>

      <Suspense fallback={<HeaderRowSkeleton />}>
        <Table />
      </Suspense>

      <Suspense>
        <ColumnMenu />
        <ColumnModals />
      </Suspense>
    </ActionParamsProvider>
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
