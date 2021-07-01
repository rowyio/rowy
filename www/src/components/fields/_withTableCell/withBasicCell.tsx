import { FormatterProps } from "react-data-grid";
import { IBasicCellProps } from "../types";

import ErrorBoundary from "components/ErrorBoundary";
import CellValidation from "components/Table/CellValidation";
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
    const { name, key } = props.column;
    const value = getCellValue(props.row, key);

    const { validationRegex, required } = (props.column as any).config;

    return (
      <ErrorBoundary fullScreen={false} basic wrap="nowrap">
        <CellValidation
          value={value}
          required={required}
          validationRegex={validationRegex}
        >
          <BasicCellComponent
            value={value}
            name={name}
            type={(props.column as any).type as FieldType}
          />
        </CellValidation>
      </ErrorBoundary>
    );
  };
}
