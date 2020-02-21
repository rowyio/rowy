import React, { Suspense } from "react";
import { FormatterProps } from "react-data-grid";

import ErrorBoundary from "components/ErrorBoundary";

export type CustomCellProps = FormatterProps & { value: any };

const withCustomCell = (Component: React.ComponentType<CustomCellProps>) => (
  props: FormatterProps
) => (
  <ErrorBoundary>
    <Suspense fallback={<div />}>
      <Component {...props} value={props.row[props.column.key]} />
    </Suspense>
  </ErrorBoundary>
);

export default withCustomCell;
