import React, { Suspense } from "react";
import { FormatterProps } from "react-data-grid";

import { makeStyles, createStyles } from "@material-ui/core";

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
const withCustomCell = (
  Component: React.ComponentType<CustomCellProps>,
  readOnly: boolean = false
) => (props: FormatterProps<any>) => {
  useStyles();
  const { updateCell } = useFiretableContext();

  const handleSubmit = (value: any) => {
    if (updateCell && !readOnly)
      updateCell(props.row.ref, props.column.key as string, value);
  };
  return (
    <ErrorBoundary fullScreen={false} basic wrap="nowrap">
      <Suspense fallback={<></>}>
        <Component
          {...props}
          docRef={props.row.ref}
          value={getCellValue(props.row, props.column.key as string)}
          onSubmit={handleSubmit}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

/*
const withCustomCell = (
  Component: React.ComponentType<CustomCellProps>,
  readOnly: boolean = false
) => (props: FormatterProps<any>) => {
  useStyles();
  const { updateCell } = useFiretableContext();
  const [component, setComponent] = useState(<></>);

  useEffect(() => {
    setTimeout(() => {
      setComponent(
        <ErrorBoundary fullScreen={false} basic wrap="nowrap">
          <Suspense fallback={<></>}>
            <Component
              {...props}
              docRef={props.row.ref}
              value={getCellValue(props.row, props.column.key as string)}
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
*/
export default withCustomCell;
