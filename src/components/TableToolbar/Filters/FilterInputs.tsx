import { Suspense, createElement } from "react";

import {
  Grid,
  MenuItem,
  ListItemText,
  Typography,
  TextField,
  InputLabel,
} from "@mui/material";
import ColumnSelect from "@src/components/Table/ColumnSelect";
import FieldSkeleton from "@src/components/SideDrawer/FieldSkeleton";

import type { useFilterInputs } from "./useFilterInputs";
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
  disabled,
}: IFilterInputsProps) {
  const columnType = selectedColumn ? getFieldType(selectedColumn) : null;

  return (
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
          {availableFilters?.operators.map((operator) => (
            <MenuItem key={operator.value} value={operator.value}>
              <ListItemText style={{ flexShrink: 0 }}>
                {operator.label}
              </ListItemText>

              {operator.secondaryLabel && (
                <Typography
                  variant="inherit"
                  color="text.disabled"
                  style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  &nbsp;{operator.secondaryLabel}
                </Typography>
              )}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={4}>
        {query.key && query.operator && (
          <>
            <InputLabel
              variant="filled"
              id={`filters-label-${query.key}`}
              htmlFor={`sidedrawer-field-${query.key}`}
            >
              Value
            </InputLabel>

            <Suspense fallback={<FieldSkeleton />}>
              {columnType &&
                createElement(getFieldProp("SideDrawerField", columnType), {
                  column: selectedColumn,
                  _rowy_ref: {},
                  value: query.value,
                  onChange: (value: any) => {
                    setQuery((query) => ({ ...query, value }));
                  },
                  disabled,
                })}
            </Suspense>
          </>
        )}
      </Grid>
    </Grid>
  );
}
