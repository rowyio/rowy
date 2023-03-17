import React, { Suspense, createElement, useEffect, useState } from "react";
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
  Stack,
  Button,
} from "@mui/material";

import ColumnSelect from "@src/components/Table/ColumnSelect";
import FieldSkeleton from "@src/components/SideDrawer/FieldSkeleton";
import IdFilterInput from "./IdFilterInput";
import { InlineErrorFallback } from "@src/components/ErrorFallback";

import { INITIAL_QUERY, useFilterInputs } from "./useFilterInputs";
import { getFieldType, getFieldProp } from "@src/components/fields";

export interface IFilterInputsProps extends ReturnType<typeof useFilterInputs> {
  disabled?: boolean;
}

export default function FilterInputs({
  filterColumns,
  selectedColumn,
  handleChangeColumn,
  availableFilters,
  query,
  setQuery,
  queries,
  setQueries,
  disabled,
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

  interface IFilterControl {
    singleQuery: typeof query;
  }

  const FilterControlFactory = () => {
    type ControllerType = typeof FilterControl;

    const [controllers, setControllers] = useState<Array<ControllerType>>([
      FilterControl,
    ]);

    const addNewFilter = () => {
      setControllers((current) => [...current, FilterControl]);
    };

    return { controllers, addNewFilter };
  };

  const FilterControl = ({ singleQuery, ...rest }: IFilterControl) => {
    const [localQuery, setLocalQuery] = useState<typeof query>(singleQuery);

    return (
      <Grid container spacing={2} sx={{ mb: 3 }} {...rest}>
        <Grid item xs={4}>
          <ColumnSelect
            multiple={false}
            label="Column"
            options={filterColumns}
            value={localQuery.key}
            onChange={(value: any) => console.log(value as string)}
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            label="Operator"
            select
            variant="filled"
            fullWidth
            value={localQuery.operator}
            disabled={
              disabled ||
              !localQuery.key ||
              availableFilters?.operators?.length === 0
            }
            onChange={(e) => {
              setLocalQuery((query) => ({
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

        <Grid item xs={4} key={localQuery.key + localQuery.operator}>
          {localQuery.key && localQuery.operator && (
            <ErrorBoundary FallbackComponent={InlineErrorFallback}>
              <InputLabel
                variant="filled"
                id={`filters-label-${localQuery.key}`}
                htmlFor={`sidedrawer-field-${localQuery.key}`}
              >
                Value
              </InputLabel>

              <Suspense fallback={<FieldSkeleton />}>
                {columnType &&
                  createElement(
                    localQuery.key === "_rowy_ref.id"
                      ? IdFilterInput
                      : getFieldProp("filter.customInput" as any, columnType) ||
                          getFieldProp("SideDrawerField", columnType),
                    {
                      column: selectedColumn,
                      _rowy_ref: {},
                      value: localQuery.value,
                      onChange: (value: any) => {
                        setLocalQuery((query) => ({ ...query, value }));
                      },
                      disabled,
                      operator: localQuery.operator,
                    }
                  )}
              </Suspense>
            </ErrorBoundary>
          )}
        </Grid>
      </Grid>
    );
  };

  const factory = FilterControlFactory();

  return (
    <Stack spacing={1} mb={2}>
      <Stack>
        {factory.controllers.map((Cntrllr, index) =>
          createElement(Cntrllr, {
            singleQuery: INITIAL_QUERY,
            ...{ key: index },
          })
        )}
      </Stack>
      <Button onClick={() => factory.addNewFilter()}>Add another filter</Button>
    </Stack>
  );
}
