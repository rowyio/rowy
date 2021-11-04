import { useState, useEffect, Suspense, createElement } from "react";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";
import _isEmpty from "lodash/isEmpty";
import { useForm } from "react-hook-form";

import {
  Popover,
  Button,
  IconButton,
  Grid,
  MenuItem,
  TextField,
  Chip,
  InputLabel,
} from "@mui/material";
import FilterIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

import ButtonWithStatus from "@src/components/ButtonWithStatus";
import FormAutosave from "@src/components/Table/ColumnMenu/FieldSettings/FormAutosave";
import FieldSkeleton from "@src/components/SideDrawer/Form/FieldSkeleton";

import { FieldType } from "@src/constants/fields";
import { TableFilter } from "@src/hooks/useTable";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { useAppContext } from "@src/contexts/AppContext";
import { DocActions } from "@src/hooks/useDoc";
import { getFieldProp } from "@src/components/fields";

const getType = (column) =>
  column.type === FieldType.derivative
    ? column.config.renderFieldType
    : column.type;

export default function Filters() {
  const { tableState, tableActions } = useProjectContext();
  const { userDoc } = useAppContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (userDoc.state.doc && tableState?.config.id) {
      if (userDoc.state.doc.tables?.[tableState?.config.id]?.filters) {
        tableActions?.table.filter(
          userDoc.state.doc.tables[tableState?.config.id].filters
        );
        tableActions?.table.orderBy();
      }
    }
  }, [userDoc.state, tableState?.config.id]);

  const filterColumns = _sortBy(Object.values(tableState!.columns), "index")
    .filter((c) => getFieldProp("filter", c.type))
    .map((c) => ({
      key: c.key,
      label: c.name,
      type: c.type,
      options: c.options,
      ...c,
    }));

  const [selectedColumn, setSelectedColumn] = useState<any>();

  const [query, setQuery] = useState<TableFilter>({
    key: "",
    operator: "",
    value: "",
  });

  const [selectedFilter, setSelectedFilter] = useState<any>();
  const type = selectedColumn ? getType(selectedColumn) : null;
  useEffect(() => {
    if (selectedColumn) {
      const _filter = getFieldProp("filter", selectedColumn.type);
      setSelectedFilter(_filter);
      let updatedQuery: TableFilter = {
        key: selectedColumn.key,
        operator: _filter.operators[0].value,
        value: _filter.defaultValue,
      };
      setQuery(updatedQuery);
    }
  }, [selectedColumn]);

  const handleClose = () => setAnchorEl(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleChangeColumn = (e) => {
    const column = _find(filterColumns, (c) => c.key === e.target.value);
    setSelectedColumn(column);
  };
  const open = Boolean(anchorEl);

  const id = open ? "simple-popper" : undefined;

  const handleUpdateFilters = (filters: TableFilter[]) => {
    userDoc.dispatch({
      action: DocActions.update,
      data: {
        tables: { [`${tableState?.config.id}`]: { filters } },
      },
    });
  };

  const { control } = useForm({
    mode: "onBlur",
  });
  return (
    <>
      <Grid container direction="row" wrap="nowrap" style={{ width: "auto" }}>
        <ButtonWithStatus
          variant="outlined"
          color="primary"
          onClick={handleClick}
          startIcon={<FilterIcon />}
          active={tableState?.filters && tableState?.filters.length > 0}
          sx={
            tableState?.filters && tableState?.filters.length > 0
              ? {
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  position: "relative",
                  zIndex: 1,
                }
              : {}
          }
        >
          {tableState?.filters && tableState?.filters.length > 0
            ? "Filtered"
            : "Filter"}
        </ButtonWithStatus>

        {(tableState?.filters ?? []).map((filter) => (
          <Chip
            key={filter.key}
            label={`${filter.key} ${filter.operator} ${
              selectedFilter?.valueFormatter
                ? selectedFilter.valueFormatter(filter.value)
                : filter.value
            }`}
            onDelete={() => handleUpdateFilters([])}
            sx={{
              borderRadius: 1,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderLeft: "none",

              backgroundColor: "background.paper",
              height: 32,

              "& .MuiChip-label": { px: 1.5 },
            }}
            variant="outlined"
          />
        ))}
      </Grid>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        sx={{
          "& .MuiPaper-root": { width: 640 },
          "& .content": { py: 3, px: 2 },
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: (theme) => theme.spacing(0.5),
            right: (theme) => theme.spacing(0.5),
          }}
        >
          <CloseIcon />
        </IconButton>
        <div className="content">
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label="Column"
                select
                variant="filled"
                hiddenLabel
                fullWidth
                value={selectedColumn?.key ?? ""}
                onChange={handleChangeColumn}
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem disabled value="" style={{ display: "none" }}>
                  Select column
                </MenuItem>
                {filterColumns.map((c) => (
                  <MenuItem key={c.key} value={c.key}>
                    {c.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="Condition"
                select
                variant="filled"
                hiddenLabel
                fullWidth
                value={query.operator}
                disabled={!query.key || selectedFilter?.operators?.length === 0}
                onChange={(e) => {
                  setQuery((query) => ({
                    ...query,
                    operator: e.target.value as string,
                  }));
                }}
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem disabled value="" style={{ display: "none" }}>
                  Select condition
                </MenuItem>
                {selectedFilter?.operators.map((operator) => (
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
                    control={control}
                    handleSave={(values) =>
                      setQuery((query) => ({
                        ...query,
                        value: values[query.key],
                      }))
                    }
                  />
                  <Suspense fallback={<FieldSkeleton />}>
                    {query.operator &&
                      createElement(getFieldProp("SideDrawerField", type), {
                        column: selectedColumn,
                        control,
                        docRef: {},
                        disabled: false,
                        onChange: () => {},
                      })}
                  </Suspense>
                </form>
              )}
            </Grid>
          </Grid>
          <Grid
            container
            sx={{
              mt: 3,
              "& .MuiButton-root": { minWidth: 100 },
            }}
            justifyContent="center"
            spacing={1}
          >
            <Grid item>
              <Button
                disabled={query.key === ""}
                onClick={() => {
                  handleUpdateFilters([]);
                  setQuery({
                    key: "",
                    operator: "",
                    value: "",
                  });
                  setSelectedColumn(null);
                }}
              >
                Clear
              </Button>
            </Grid>
            <Grid item>
              <Button
                disabled={
                  query.value !== true &&
                  query.value !== false &&
                  _isEmpty(query.value) &&
                  typeof query.value !== "number" &&
                  typeof query.value !== "object"
                }
                color="primary"
                variant="contained"
                onClick={() => {
                  handleUpdateFilters([query]);
                  handleClose();
                }}
              >
                Apply
              </Button>
            </Grid>
          </Grid>
        </div>
      </Popover>
    </>
  );
}
