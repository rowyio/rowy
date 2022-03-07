import { Suspense, createElement } from "react";
import { useForm } from "react-hook-form";

import { Grid, MenuItem, TextField, InputLabel } from "@mui/material";

import MultiSelect from "@rowy/multiselect";
import FormAutosave from "@src/components/Table/ColumnMenu/FieldSettings/FormAutosave";
import FieldSkeleton from "@src/components/SideDrawer/Form/FieldSkeleton";

import type { useFilterInputs } from "./useFilterInputs";
import { getColumnType, getFieldProp } from "@src/components/fields";

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
  disabled,
}: IFilterInputsProps) {
  // Need to use react-hook-form with autosave for the value field,
  // since we render the side drawer field for that type
  const { control } = useForm({
    mode: "onBlur",
    defaultValues: selectedColumn ? { [selectedColumn.key]: query.value } : {},
  });

  const columnType = selectedColumn ? getColumnType(selectedColumn) : null;

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={4}>
        <MultiSelect
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
        >
          <MenuItem disabled value="" style={{ display: "none" }}>
            Select operator
          </MenuItem>
          {availableFilters?.operators.map((operator) => (
            <MenuItem key={operator.value} value={operator.value}>
              {operator.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={4}>
        {query.key && query.operator && (
          <form>
            <InputLabel
              variant="filled"
              id={`filters-label-${query.key}`}
              htmlFor={`sidedrawer-field-${query.key}`}
            >
              Value
            </InputLabel>

            <FormAutosave
              debounce={0}
              control={control}
              handleSave={(values) => {
                if (values[query.key] !== undefined) {
                  setQuery((query) => ({
                    ...query,
                    value: values[query.key],
                  }));
                }
              }}
            />
            <Suspense fallback={<FieldSkeleton />}>
              {columnType &&
                createElement(getFieldProp("SideDrawerField", columnType), {
                  column: selectedColumn,
                  control,
                  docRef: {},
                  disabled,
                  onChange: () => {},
                })}
            </Suspense>
          </form>
        )}
      </Grid>
    </Grid>
  );
}
