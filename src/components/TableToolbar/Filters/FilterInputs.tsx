import { Suspense, createElement } from "react";
import { ErrorBoundary } from "react-error-boundary";

import {
  Grid,
  MenuItem,
  ListItemText,
  Divider,
  ListSubheader,
  Typography,
  TextField,
  InputLabel,
  IconButton,
} from "@mui/material";

import ColumnSelect from "@src/components/Table/ColumnSelect";
import FieldSkeleton from "@src/components/SideDrawer/FieldSkeleton";
import IdFilterInput from "./IdFilterInput";
import { InlineErrorFallback } from "@src/components/ErrorFallback";

import { getFieldType, getFieldProp } from "@src/components/fields";
import type { IFieldConfig } from "@src/components/fields/types";

import { TableFilter } from "@src/types/table";

import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import { useFilterInputs } from "./useFilterInputs";

export interface IFilterInputsProps {
  filterColumns: ReturnType<typeof useFilterInputs>["filterColumns"];
  selectedColumn: ReturnType<typeof useFilterInputs>["filterColumns"][0];
  availableFilters: IFieldConfig["filter"];
  disabled?: boolean;
  query: TableFilter;
  setQuery: (query: TableFilter) => void;
  handleDelete: () => void;
  index: number;
  noOfQueries: number;
  handleChangeColumn: (column: string) => void;
  joinOperator: "AND" | "OR";
  setJoinOperator: (operator: "AND" | "OR") => void;
}

export default function FilterInputs({
  filterColumns,
  selectedColumn,
  handleChangeColumn,
  availableFilters,
  query,
  setQuery,
  disabled,
  joinOperator,
  setJoinOperator,
  handleDelete,
  index,
  noOfQueries,
}: IFilterInputsProps) {
  const columnType = selectedColumn ? getFieldType(selectedColumn) : null;

  const operators = availableFilters?.operators ?? [];
  const renderedOperatorItems = operators.map((operator) => (
    <MenuItem key={operator.value} value={operator.value}>
      <ListItemText style={{ flexShrink: 0 }}>{operator.label}</ListItemText>

      {operator.secondaryLabel && (
        <Typography
          variant="inherit"
          color="text.disabled"
          sx={{ overflow: "hidden", textOverflow: "ellipsis", ml: 1 }}
        >
          &nbsp;{operator.secondaryLabel}
        </Typography>
      )}
    </MenuItem>
  ));

  // Insert ListSubheader components in between groups of operators
  for (let i = 0; i < operators.length; i++) {
    if (!operators[i].group) continue;

    if (i === 0 || operators[i - 1].group !== operators[i].group) {
      renderedOperatorItems.splice(
        i === 0 ? 0 : i + 1,
        0,
        <ListSubheader key={operators[i].group}>
          {operators[i].group}
        </ListSubheader>
      );

      if (i > 0)
        renderedOperatorItems.splice(
          i + 1,
          0,
          <Divider key={`divider-${operators[i].group}`} variant="middle" />
        );
    }
  }

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={3.5}>
        <ColumnSelect
          multiple={false}
          label="Column"
          options={filterColumns}
          value={query.key}
          onChange={(newKey: string | null) => handleChangeColumn(newKey ?? "")}
          disabled={disabled}
        />
      </Grid>

      <Grid item xs={3.5}>
        <TextField
          label="Operator"
          select
          variant="filled"
          fullWidth
          value={query.operator}
          disabled={
            disabled || !query.key || availableFilters?.operators?.length === 0
          }
          onChange={(e) => {
            const newQuery = {
              ...query,
              operator: e.target.value as TableFilter["operator"],
            };

            setQuery(newQuery);
          }}
          SelectProps={{ displayEmpty: true }}
          sx={{
            "& .MuiSelect-select": { display: "flex" },
          }}
        >
          <MenuItem disabled value="" style={{ display: "none" }}>
            Select operator
          </MenuItem>
          {renderedOperatorItems}
        </TextField>
      </Grid>

      <Grid item xs={3.5} key={query.key + query.operator}>
        {query.key &&
          query.operator &&
          query.operator !== "is-empty" &&
          query.operator != "is-not-empty" && (
            <ErrorBoundary FallbackComponent={InlineErrorFallback}>
              <InputLabel
                variant="filled"
                id={`filters-label-${query.key}`}
                htmlFor={`sidedrawer-field-${query.key}`}
              >
                Value
              </InputLabel>

              <Suspense fallback={<FieldSkeleton />}>
                {columnType &&
                  createElement(
                    query.key === "_rowy_ref.id"
                      ? IdFilterInput
                      : getFieldProp("filter.customInput" as any, columnType) ||
                          getFieldProp("SideDrawerField", columnType),
                    {
                      column: selectedColumn,
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
                      disabled,
                      operator: query.operator,
                    }
                  )}
              </Suspense>
            </ErrorBoundary>
          )}
      </Grid>

      <Grid
        item
        xs={1.5}
        sx={{
          display: "flex",
          alignItems: "flex-end",
          paddingBottom: "5px",
          justifyContent: "space-between",
        }}
      >
        <IconButton
          aria-label="Remove"
          sx={{ padding: 0 }}
          onClick={handleDelete}
        >
          {<DeleteIcon />}
        </IconButton>
        <DragIndicatorOutlinedIcon
          color="disabled"
          sx={[
            {
              marginRight: "6px",
            },
          ]}
        />
      </Grid>

      {noOfQueries > 1 &&
        index !== noOfQueries - 1 &&
        (index === 0 ? (
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={3.5}>
                <TextField
                  select
                  variant="filled"
                  fullWidth
                  value={joinOperator}
                  onChange={(e) =>
                    setJoinOperator(e.target.value === "AND" ? "AND" : "OR")
                  }
                  sx={{
                    "& .MuiSelect-select": {
                      display: "flex",
                    },
                  }}
                >
                  <MenuItem value="AND">And</MenuItem>
                  <MenuItem value="OR">Or</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Typography paddingLeft={1}>
              {joinOperator === "AND" ? "And" : "Or"}
            </Typography>
          </Grid>
        ))}
    </Grid>
  );
}
