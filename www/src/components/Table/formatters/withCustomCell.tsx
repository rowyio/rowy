import React, { Suspense, useState, useEffect } from "react";
import { FormatterProps } from "react-data-grid";

import { makeStyles, createStyles } from "@material-ui/core";
import { FieldType } from "constants/fields";
import ErrorBoundary from "components/ErrorBoundary";
import { useFiretableContext } from "../../../contexts/firetableContext";
import _get from "lodash/get";
const useStyles = makeStyles((theme) =>
  createStyles({
    "@global": {
      ".rdg-cell-mask.rdg-selected": {
        // Prevent 3px-wide cell selection border when both react-data-grid
        // cell selection mask and our custom one are active
        boxShadow: `0 0 0 1px ${theme.palette.background.paper} inset`,
      },
    },
  })
);

export type CustomCellProps = FormatterProps<any> & {
  value: any;
  onSubmit: (value: any) => void;
  docRef: firebase.firestore.DocumentReference;
};

const getCellValue = (row, key) => {
  if (key.includes(".")) return _get(row, key);
  return row[key];
};
/**
 * HOC to wrap around custom cell formatters.
 * Displays react-data-grid’s blue selection border when the cell is selected.
 * @param Component The formatter component to display
 * @param readOnly Prevent the formatter from updating the cell value
 */
// const withCustomCell = (
//   Component: React.ComponentType<CustomCellProps>,
//   readOnly: boolean = false
// ) => (props: FormatterProps<any>) => {
//   useStyles();
//   const { updateCell } = useFiretableContext();

//   const handleSubmit = (value: any) => {
//     if (updateCell && !readOnly)
//       updateCell(props.row.ref, props.column.key as string, value);
//   };
//   return (
//     <ErrorBoundary fullScreen={false} basic wrap="nowrap">
//       <Suspense fallback={<></>}>
//         <Component
//           {...props}
//           docRef={props.row.ref}
//           value={getCellValue(props.row, props.column.key as string)}
//           onSubmit={handleSubmit}
//         />
//       </Suspense>
//     </ErrorBoundary>
//   );
// };

const BasicCell = ({ value, type, name }) => {
  if (typeof value === "string") return <>{value}</>;
  if ([FieldType.checkbox, FieldType.action, FieldType.subTable].includes(type))
    return <>{name}</>;
  return <></>;
};
const withCustomCell = (
  Component: React.ComponentType<CustomCellProps>,
  readOnly: boolean = false
) => (props: FormatterProps<any>) => {
  useStyles();
  const { updateCell } = useFiretableContext();
  const value = getCellValue(props.row, props.column.key as string);
  const basicCell = (
    <BasicCell
      value={value}
      type={(props.column as any).type}
      name={(props.column as any).name}
    />
  );
  const [component, setComponent] = useState(basicCell);

  useEffect(() => {
    setTimeout(() => {
      setComponent(
        <ErrorBoundary fullScreen={false} basic wrap="nowrap">
          <Suspense fallback={basicCell}>
            <Component
              {...props}
              docRef={props.row.ref}
              value={value}
              onSubmit={handleSubmit}
            />
          </Suspense>
        </ErrorBoundary>
      );
    });
  }, []);
  const handleSubmit = (value: any) => {
    if (updateCell && !readOnly)
      updateCell(props.row.ref, props.column.key as string, value);
  };
  return component;
};

export default withCustomCell;
