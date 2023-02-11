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

  const columnTypes = selectedColumn.length > 0 ? selectedColumn.map(i => getFieldType(i)) : null;

  const operatorsLists = availableFilters?.map(a => a?.operators ?? []) || [];
  const renderedOperatorItems = operatorsLists.map((operator: any) => (
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
  // lists of possible operators (j) are all less than 10 items long and users will likely have a few filters (i) at most
  for (let i = 0; i < operatorsLists.length; i++) {
    for (let j = 0; j < i; j++) {
      if (!operatorsLists[i][j].group) continue;

    if (j === 0 || operatorsLists[i][j-1].group !== operatorsLists[i][j].group) {
      renderedOperatorItems.splice(
        j === 0 ? 0 : j + 1,
        0,
        <ListSubheader key={operatorsLists[i][j].group}>
          {operatorsLists[i][j].group}
        </ListSubheader>
      );

      if (j > 0)
        renderedOperatorItems.splice(
          j + 1,
          0,
          <Divider key={`divider-${operatorsLists[i][j].group}`} variant="middle" />
        );
    }
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
              value={query[i]?.key}
              onChange={(e: string | null) => handleChangeColumn(e, i)}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              label="Operator"
              select
              variant="filled"
              fullWidth
              value={query[i]?.operator}
              disabled={
                disabled || !query[i] || availableFilters[i]?.operators?.length === 0
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

          <Grid item xs={4} key={query[i]?.key + query[i]?.operator}>
            {query[i]?.key && query[i]?.operator && (
              <ErrorBoundary FallbackComponent={InlineErrorFallback}>
                <InputLabel
                  variant="filled"
                  id={`filters-label-${query[i].key}`}
                  htmlFor={`sidedrawer-field-${query[i]?.key}`}
                >
                  Value
                </InputLabel>

                <Suspense fallback={<FieldSkeleton />}>
                  {columnTypes &&
                    createElement(
                      query[i].key === "_rowy_ref.id"
                        ? IdFilterInput
                        : getFieldProp("filter.customInput" as any, columnTypes[i]) ||
                        getFieldProp("SideDrawerField", columnTypes[i]),
                      {
                        column: selectedColumn,
                        _rowy_ref: {},
                        value: query[i]?.value,
                        onChange: (value: any) => {
                          setQuery((query) => ({ ...query, value }));
                        },
                        disabled,
                        operator: query[i]?.operator,
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
