import { Button, Grid, InputLabel, Stack } from "@mui/material";

import BulkEditPopover from "./BulkEditPopover";
import ColumnSelect from "@src/components/Table/ColumnSelect";
import { TableBulkEdit } from "@src/types/table";
import { useAtom, useSetAtom } from "jotai";
import { useSnackbar } from "notistack";

import {
  tableColumnsOrderedAtom,
  tableScope,
  updateFieldAtom,
} from "@src/atoms/tableScope";
import { generateId } from "@src/utils/table";
import { getFieldType, getFieldProp } from "@src/components/fields";
import { Suspense, createElement, useMemo, useState } from "react";
import { find } from "lodash-es";
import { ErrorBoundary } from "react-error-boundary";
import FieldSkeleton from "@src/components/SideDrawer/FieldSkeleton";
import { InlineErrorFallback } from "@src/components/ErrorFallback";
import { RowSelectionState } from "@tanstack/react-table";

export const NON_EDITABLE_TYPES: string[] = [
  "ID",
  "CREATED_AT",
  "UPDATED_AT",
  "UPDATED_BY",
  "CREATED_BY",
  "COLOR",
  "ARRAY_SUB_TABLE",
  "SUB_TABLE",
  "GEO_POINT",
];

export default function BulkEdit({
  selectedRows,
}: {
  selectedRows: RowSelectionState;
}) {
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  const updateField = useSetAtom(updateFieldAtom, tableScope);

  const { enqueueSnackbar } = useSnackbar();

  const filterColumns = useMemo(() => {
    return tableColumnsOrdered
      .filter((col) => !NON_EDITABLE_TYPES.includes(col.type))
      .map((c) => ({
        value: c.key,
        label: c.name,
        type: c.type,
        key: c.key,
        index: c.index,
        config: c.config || {},
      }));
  }, [tableColumnsOrdered]);

  const INITIAL_QUERY: TableBulkEdit | null =
    filterColumns.length > 0
      ? {
          key: filterColumns[0].key,
          value: "",
          id: generateId(),
        }
      : null;

  const [query, setQuery] = useState<TableBulkEdit | null>(INITIAL_QUERY);
  const selectedColumn = find(filterColumns, ["key", query?.key]);
  const columnType = selectedColumn ? getFieldType(selectedColumn) : null;

  const handleColumnChange = (newKey: string | null) => {
    const column = find(filterColumns, ["key", newKey]);
    if (column && newKey) {
      const updatedQuery: TableBulkEdit = {
        key: newKey,
        value: "",
        id: generateId(),
      };
      setQuery(updatedQuery);
    }
  };

  const handleBulkUpdate = async (): Promise<void> => {
    const selectedRowsArr = Object.keys(selectedRows);
    try {
      const updatePromises = selectedRowsArr.map(async (rowKey) => {
        return updateField({
          path: rowKey,
          fieldName: query?.key ?? "",
          value: query?.value,
        });
      });

      await Promise.all(updatePromises);
    } catch (e) {
      enqueueSnackbar((e as Error).message, { variant: "error" });
    }
  };

  return (
    <>
      {filterColumns.length > 0 && INITIAL_QUERY && (
        <BulkEditPopover>
          {({ handleClose }) => (
            <div style={{ padding: "20px" }}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <ColumnSelect
                    multiple={false}
                    label="Column"
                    options={filterColumns}
                    value={query?.key ?? INITIAL_QUERY.key}
                    onChange={(newKey: string | null) =>
                      handleColumnChange(newKey ?? INITIAL_QUERY.key)
                    }
                    disabled={false}
                  />
                </Grid>
                <Grid item xs={6} key={query?.key}>
                  {query?.key && (
                    <ErrorBoundary FallbackComponent={InlineErrorFallback}>
                      <InputLabel
                        variant="filled"
                        id={`filters-label-${query?.key}`}
                        htmlFor={`sidedrawer-field-${query?.key}`}
                      >
                        Value
                      </InputLabel>

                      <Suspense fallback={<FieldSkeleton />}>
                        {columnType &&
                          createElement(
                            getFieldProp(
                              "filter.customInput" as any,
                              columnType
                            ) || getFieldProp("SideDrawerField", columnType),
                            {
                              column: find(filterColumns, ["key", query.key]),
                              _rowy_ref: {},
                              value: query.value,
                              onSubmit: () => {},
                              onChange: (value: any) => {
                                const newQuery = {
                                  ...query,
                                  value,
                                };
                                setQuery(newQuery);
                              },
                            }
                          )}
                      </Suspense>
                    </ErrorBoundary>
                  )}
                </Grid>
              </Grid>

              <Stack
                direction="row"
                sx={{ "& .MuiButton-root": { minWidth: 100 } }}
                justifyContent="center"
                spacing={1}
              >
                <Button
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Cancel
                </Button>

                <Button
                  color="primary"
                  variant="contained"
                  disabled={query?.value === ""}
                  onClick={() => {
                    handleBulkUpdate();
                    handleClose();
                  }}
                >
                  Apply
                </Button>
              </Stack>
            </div>
          )}
        </BulkEditPopover>
      )}
    </>
  );
}
