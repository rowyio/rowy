import React from "react";
import { FormatterProps } from "react-data-grid";
import { IBasicCellProps } from "../types";

import ErrorBoundary from "components/ErrorBoundary";
import { FieldType } from "constants/fields";
import { getCellValue } from "utils/fns";

/**
 * HOC to wrap around table cell components.
 * Renders read-only BasicCell only.
 * @param BasicCellComponent The light cell component to display at all times
 */
export default function withBasicCell(
  BasicCellComponent: React.ComponentType<IBasicCellProps>
) {
  return function BasicCell(props: FormatterProps<any>) {
    return (
      <ErrorBoundary fullScreen={false} basic wrap="nowrap">
        <BasicCellComponent
          value={getCellValue(props.row, props.column.key)}
          name={props.column.name}
          type={(props.column as any).type as FieldType}
        />
      </ErrorBoundary>
    );
  };
}
