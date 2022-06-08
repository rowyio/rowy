import { Suspense } from "react";
import { useAtom, Provider } from "jotai";
import { useParams } from "react-router-dom";
import { isEmpty } from "lodash-es";

import { Fade } from "@mui/material";

//import TableHeaderSkeleton from "@src/components/Table/Skeleton/TableHeaderSkeleton";
//import HeaderRowSkeleton from "@src/components/Table/Skeleton/HeaderRowSkeleton";
//import EmptyTable from "@src/components/Table/EmptyTable";
import Function from "@src/components/Function";

import { currentUserAtom, globalScope } from "@src/atoms/globalScope";
// import TableSourceFirestore from "@src/sources/TableSourceFirestore";
// import {
//   tableScope,
//   tableIdAtom,
//   tableSettingsAtom,
//   tableSchemaAtom,
// } from "@src/atoms/tableScope";

export default function FunctionPage() {
  // const [tableId] = useAtom(tableIdAtom, tableScope);
  // const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  // const [tableSchema] = useAtom(tableSchemaAtom, tableScope);

  // console.log(tableSchema);

  // if (isEmpty(tableSchema.columns))
  //   return (
  //     <Fade style={{ transitionDelay: "500ms" }}>
  //       <div>
  //         <EmptyTable />
  //       </div>
  //     </Fade>
  //   );

  return <Function key="function" />;
}

function ProvidedFunctionPage() {
  const { id } = useParams();
  const [currentUser] = useAtom(currentUserAtom, globalScope);

  return (
    <Suspense
      fallback={
        <>
          {/* <TableHeaderSkeleton />
          <HeaderRowSkeleton /> */}
        </>
      }
    >
      {/* <Provider
        key={id}
        scope={tableScope}
        initialValues={[
          [tableIdAtom, id],
          [currentUserAtom, currentUser],
        ]}
      > */}
      {/* <TableSourceFirestore /> */}
      <FunctionPage />
      {/* </Provider> */}
    </Suspense>
  );
}
