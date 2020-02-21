import React, { Suspense } from "react";
import { FormatterProps } from "react-data-grid";

import ErrorBoundary from "components/ErrorBoundary";
import { useFiretableContext } from "../../../contexts/firetableContext";

export type CustomCellProps = FormatterProps & {
  value: any;
  onSubmit: (value: any) => void;
};

const withCustomCell = (Component: React.ComponentType<CustomCellProps>) => (
  props: FormatterProps
) => {
  const { updateCell } = useFiretableContext();

  const handleSubmit = (value: any) => {
    if (updateCell) updateCell(props.row.ref, props.column.key, value);
  };

  return (
    <ErrorBoundary>
      <Suspense fallback={<div />}>
        <Component
          {...props}
          value={props.row[props.column.key]}
          onSubmit={handleSubmit}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

export default withCustomCell;
