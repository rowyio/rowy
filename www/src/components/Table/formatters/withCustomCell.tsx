import React, { Suspense, useState, useEffect } from "react";
import { FormatterProps } from "react-data-grid";

// import { makeStyles, createStyles } from "@material-ui/core";
import { Link } from "@material-ui/core";

import ErrorBoundary from "components/ErrorBoundary";
import { useFiretableContext } from "../../../contexts/firetableContext";

import { FieldType } from "constants/fields";
import { getCellValue } from "utils/fns";

// const useStyles = makeStyles((theme) =>
//   createStyles({
//     "@global": {
//       ".rdg-cell-mask.rdg-selected": {
//         // Prevent 3px-wide cell selection border when both react-data-grid
//         // cell selection mask and our custom one are active
//         boxShadow: `0 0 0 1px ${theme.palette.background.paper} inset`,
//       },
//     },
//   })
// );

export type CustomCellProps = FormatterProps<any> & {
  value: any;
  onSubmit: (value: any) => void;
  docRef: firebase.firestore.DocumentReference;
};

const BasicCell = ({ value, type, name }) => {
  switch (type) {
    case FieldType.singleSelect:
    case FieldType.shortText:
    case FieldType.longText:
    case FieldType.shortText:
    case FieldType.email:
    case FieldType.phone:
    case FieldType.number:
    case FieldType.slider:
      return typeof value === "string" ? <>{value}</> : <></>;
    case FieldType.url:
      return typeof value === "string" ? (
        <Link
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          underline="always"
          style={{ fontWeight: "bold" }}
        >
          {value}
        </Link>
      ) : (
        <></>
      );
    case FieldType.subTable:
      return (
        <>
          {value && value.count} {name}:
        </>
      );
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
  // useStyles();
  const { updateCell } = useFiretableContext();

  const value = getCellValue(props.row, props.column.key as string);
  const [localValue, setLocalValue] = useState(value);
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Initially display basicCell to improve scroll performance
  const basicCell = (
    <BasicCell
      value={localValue}
      name={(props.column as any).name}
      type={(props.column as any).type as FieldType}
    />
  );

  const [component, setComponent] = useState(basicCell);

  // Switch to heavy cell component on mount
  useEffect(() => {
    setTimeout(() => {
      setComponent(
        <ErrorBoundary fullScreen={false} basic wrap="nowrap">
          <Suspense fallback={basicCell}>
            <Component
              {...props}
              docRef={props.row.ref}
              value={localValue}
              onSubmit={handleSubmit}
            />
          </Suspense>
        </ErrorBoundary>
      );
    });
  }, [localValue]);

  const handleSubmit = (value: any) => {
    if (updateCell && !readOnly) {
      updateCell(props.row.ref, props.column.key as string, value);
      setLocalValue(value);
    }
  };

  return component;
};

export default withCustomCell;
