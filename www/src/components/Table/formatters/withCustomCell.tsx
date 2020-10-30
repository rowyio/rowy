import React, { Suspense, useState, useEffect } from "react";
import { FormatterProps } from "react-data-grid";

import { makeStyles, createStyles } from "@material-ui/core";

import ErrorBoundary from "components/ErrorBoundary";
import { useFiretableContext } from "../../../contexts/firetableContext";
import _get from "lodash/get";
import { FieldType } from "constants/fields";
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

const BasicCell = ({ value, type, name }) => {
  switch (type) {
    case FieldType.singleSelect:
    case FieldType.longText:
      return <>{value}</>;
    case FieldType.checkbox:
      return <>{name}</>;
    case FieldType.action:
      return <>{value ? value.status : name}</>;
    default:
      return <></>;
  }
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

  const value = getCellValue(props.row, props.column.key as string);
  const lazyCell = (
    <BasicCell
      value={value}
      name={(props.column as any).name}
      type={(props.column as any).type as FieldType}
    />
  );
  const [component, setComponent] = useState(lazyCell);
  useEffect(() => {
    setTimeout(() => {
      setComponent(
        <ErrorBoundary fullScreen={false} basic wrap="nowrap">
          <Suspense fallback={lazyCell}>
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
  }, [value]);
  const handleSubmit = (value: any) => {
    if (updateCell && !readOnly)
      updateCell(props.row.ref, props.column.key as string, value);
  };
  return component;
};

export default withCustomCell;
