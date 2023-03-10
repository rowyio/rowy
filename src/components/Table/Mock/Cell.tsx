import { createElement } from "react";

import StyledTable from "@src/components/Table/Styled/StyledTable";
import StyledCell from "@src/components/Table/Styled/StyledCell";
import EmptyState from "@src/components/EmptyState";

import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";
import { DEFAULT_ROW_HEIGHT } from "@src/components/Table";
import mockValue from "./mockValue";

export interface ICellProps
  extends Partial<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >
  > {
  field: string;
  type: FieldType;
  value: any;
  name?: string;
  rowHeight?: number;
}

export default function Cell({
  field,
  type,
  value,
  name,
  rowHeight = DEFAULT_ROW_HEIGHT,
  ...props
}: ICellProps) {
  const tableCell = type ? getFieldProp("TableCell", type) : null;
  value = mockValue(value, type);

  return (
    <StyledTable>
      <StyledCell
        {...props}
        style={
          {
            ...props.style,
            height: rowHeight,
            "--row-height": rowHeight,
          } as any
        }
      >
        {tableCell ? (
          createElement(tableCell, {
            value,
            column: {
              columnDef: {
                meta: {
                  type,
                  key: field,
                  name,
                  config: { options: [] },
                  editable: false,
                },
              },
            },
            row: {
              original: {
                _rowy_ref: { path: "_rowy_/_mockCell" },
                [field]: value,
              },
            },
            focusInsideCell: false,
            disabled: true,
            rowHeight: DEFAULT_ROW_HEIGHT,
          })
        ) : typeof value === "string" ||
          typeof value === "number" ||
          value === undefined ||
          value === null ? (
          value
        ) : typeof value === "boolean" ? (
          value.toString()
        ) : (
          <EmptyState basic wrap="nowrap" message="Invalid column type" />
        )}
      </StyledCell>
    </StyledTable>
  );
}
