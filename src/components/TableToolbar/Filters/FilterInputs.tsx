import { Suspense, createElement, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import {
  Stack,
  Grid,
  MenuItem,
  ListItemText,
  Divider,
  ListSubheader,
  Typography,
  TextField,
  InputLabel,
  Button,
  IconButton
} from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';

import ColumnSelect from "@src/components/Table/ColumnSelect";
import FieldSkeleton from "@src/components/SideDrawer/FieldSkeleton";
import IdFilterInput from "./IdFilterInput";
import { InlineErrorFallback } from "@src/components/ErrorFallback";

import type { useFilterInputs } from "./useFilterInputs";
import { getFieldType, getFieldProp } from "@src/components/fields";

export interface IFilterInputsProps extends ReturnType<typeof useFilterInputs> {
  disabled?: boolean;
}

export default function FilterInputs(this: any, {
  filterColumns,
  selectedColumn,
  handleChangeColumn,
  availableFilters,
  query,
  setQuery,
  disabled,
}: IFilterInputsProps) {


  const [numFilters, setNumFilters] = useState(1)

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

  function handleAddFilter() {
    setNumFilters(numFilters + 1)
    console.log(numFilters)
  }

  function handleDeleteFilter() {
    setNumFilters(numFilters - 1)
  }

  // Render input for given num of filters
  function getFiltersInputs() {
    var rows = []
    for (let i = 0; i < numFilters; i++) {
      console.log("test")
      rows.push(
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <ColumnSelect
              multiple={false}
              label="Column"
              options={filterColumns}
              value={query.key}
              onChange={handleChangeColumn}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={4}>
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
                setQuery((query) => ({
                  ...query,
                  operator: e.target.value as string,
                }));
              }}
              SelectProps={{ displayEmpty: true }}
              sx={{ "& .MuiSelect-select": { display: "flex" } }}
            >
              <MenuItem disabled value="" style={{ display: "none" }}>
                Select operator
              </MenuItem>
              {renderedOperatorItems}
            </TextField>
          </Grid>

          <Grid item xs={4} key={query.key + query.operator}>
            {query.key && query.operator && (
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
                        onChange: (value: any) => {
                          setQuery((query) => ({ ...query, value }));
                        },
                        disabled,
                        operator: query.operator,
                      }
                    )}
                </Suspense>
              </ErrorBoundary>
            )}
            <IconButton onClick={handleDeleteFilter} aria-label="delete filter">
              <ClearIcon />
            </IconButton>
          </Grid>
        </Grid>)
    }
    return rows
  }

  return (
    <Stack spacing={2}>
      {getFiltersInputs()}
      <Button onClick={handleAddFilter} variant="contained" endIcon={<AddIcon />}>
        Add another filter
      </Button>
    </Stack>
  );
}
