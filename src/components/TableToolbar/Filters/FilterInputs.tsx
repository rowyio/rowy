import React, { Suspense, createElement } from "react";
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
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import ColumnSelect from "@src/components/Table/ColumnSelect";
import FieldSkeleton from "@src/components/SideDrawer/FieldSkeleton";
import IdFilterInput from "./IdFilterInput";
import { InlineErrorFallback } from "@src/components/ErrorFallback";

import { useFilterInputs } from "./useFilterInputs";
import { getFieldType, getFieldProp } from "@src/components/fields";
import { tableColumnsOrderedAtom } from "@src/atoms/tableScope/table";
import { tableScope } from "@src/atoms/tableScope";
import { useAtom } from "jotai";
import { TableFilter } from "@src/types/table";

export interface IFilterInputsProps {
  disabled?: boolean;
  onLocalChange: (filter: TableFilter) => void;
  setInitial: (filter: TableFilter) => void;
  onDelete: (key: string) => void;
  filtersLength?: number;
}

export default function FilterInputs({
  disabled,
  filtersLength,
  onLocalChange,
  setInitial,
  onDelete,
}: IFilterInputsProps) {
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  const {
    filterColumns,
    selectedColumn,
    handleChangeColumn,
    availableFilters,
    query,
    setQuery,
  }: ReturnType<typeof useFilterInputs> = useFilterInputs(tableColumnsOrdered);

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
    <Grid
      container
      spacing={2}
      sx={{ mb: 3 }}
      columns={14}
      display="grid"
      gridTemplateColumns="1fr 1fr 1fr auto"
      justifyContent="space-between"
      alignItems="flex-end"
    >
      <Grid item>
        <ColumnSelect
          multiple={false}
          label="Column"
          options={filterColumns}
          value={query.key}
          onChange={(value: any) => {
            handleChangeColumn(value as string).then(() => {
              setInitial({
                ...query,
                key: value as string,
                operator: availableFilters?.operators[0].value,
              } as TableFilter);
            });
          }}
          disabled={disabled}
        />
      </Grid>

      <Grid item>
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
            onLocalChange({
              ...query,
              operator: e.target.value as string,
            } as TableFilter);
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

      <Grid item key={query.key + query.operator}>
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
                      onLocalChange({ ...query, value } as TableFilter);
                    },
                    disabled,
                    operator: query.operator,
                  }
                )}
            </Suspense>
          </ErrorBoundary>
        )}
      </Grid>
      <Grid item>
        {filtersLength && filtersLength > 1 && (
          <IconButton onClick={() => onDelete(query.key)}>
            <CloseIcon />
          </IconButton>
        )}
      </Grid>
    </Grid>
  );
}

interface IFilterContainer {
  children: React.ReactElement[];
  addControl: () => void;
}

const FiltersContainer = ({ children, addControl }: IFilterContainer) => {
  return (
    <Stack spacing={1} mb={2}>
      <Box>{children}</Box>
      <Button onClick={() => addControl()}>Add another filter</Button>
    </Stack>
  );
};

export { FiltersContainer };
