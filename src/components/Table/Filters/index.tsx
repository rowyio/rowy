import React, { useState, useEffect } from "react";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";
import _isEmpty from "lodash/isEmpty";
import { useForm } from "react-hook-form";
import { makeStyles, createStyles } from "@mui/styles";
import {
  Popover,
  Button,
  IconButton,
  Grid,
  MenuItem,
  TextField,
  Chip,
} from "@mui/material";
import FilterIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import ButtonWithStatus from "components/ButtonWithStatus";
import { FieldType } from "constants/fields";
import { TableFilter } from "hooks/useTable";
import { useProjectContext } from "contexts/ProjectContext";
import { useAppContext } from "contexts/AppContext";
import { DocActions } from "hooks/useDoc";
import { getFieldProp } from "@src/components/fields";
const getType = (column) =>
  column.type === FieldType.derivative
    ? column.config.renderFieldType
    : column.type;

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: { width: 640 },

    closeButton: {
      position: "absolute",
      top: theme.spacing(0.5),
      right: theme.spacing(0.5),
    },

    content: { padding: theme.spacing(2, 3) },

    topRow: { marginBottom: theme.spacing(3.5) },
    bottomButtons: {
      marginTop: theme.spacing(3),
      "& .MuiButton-root": { minWidth: 100 },
    },

    activeButton: {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      position: "relative",
      zIndex: 1,
    },

    filterChip: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
      borderLeft: "none",
      backgroundColor: theme.palette.background.paper,
      height: 32,
      // paddingLeft: theme.shape.borderRadius,
      // marginLeft: -theme.shape.borderRadius,
      paddingRight: theme.spacing(0.5) + " !important",
    },
    filterChipLabel: {
      padding: theme.spacing(0, 1.5),
    },
  })
);

const Filters = () => {
  const { tableState, tableActions } = useProjectContext();
  const { userDoc } = useAppContext();

  useEffect(() => {
    if (userDoc.state.doc && tableState?.tablePath) {
      if (userDoc.state.doc.tables?.[tableState?.tablePath]?.filters) {
        tableActions?.table.filter(
          userDoc.state.doc.tables[tableState?.tablePath].filters
        );
        tableActions?.table.orderBy();
      }
    }
  }, [userDoc.state, tableState?.tablePath]);
  const filterColumns = _sortBy(Object.values(tableState!.columns), "index")
    .filter((c) => getFieldProp("filter", c.type))
    .map((c) => ({
      key: c.key,
      label: c.name,
      type: c.type,
      options: c.options,
      ...c,
    }));
  const classes = useStyles();

  const [selectedColumn, setSelectedColumn] = useState<any>();

  const [query, setQuery] = useState<TableFilter>({
    key: "",
    operator: "",
    value: "",
  });

  const [operators, setOperators] = useState<any[]>([]);
  const type = selectedColumn ? getType(selectedColumn) : null;
  //const [filter, setFilter] = useState<any>();
  const customFieldInput = type ? getFieldProp("SideDrawerField", type) : null;
  useEffect(() => {
    if (selectedColumn) {
      const _filter = getFieldProp("filter", selectedColumn.type);
      //setFilter(_filter)
      setOperators(_filter?.operators ?? []);
      let updatedQuery: TableFilter = {
        key: selectedColumn.key,
        operator: _filter.operators[0].value,
        value: _filter.defaultValue,
      };
      setQuery(updatedQuery);
    }
  }, [selectedColumn]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
        tables: { [`${tableState?.tablePath}`]: { filters } },
      },
    });
  };

  const { control } = useForm({
    mode: "onBlur",
    // defaultValues: {
    //   [fieldName]:
    //     config.defaultValue?.value ?? getFieldProp("initialValue", _type),
    // },
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
          className={
            tableState?.filters && tableState?.filters.length > 0
              ? classes.activeButton
              : ""
          }
        >
          {tableState?.filters && tableState?.filters.length > 0
            ? "Filtered"
            : "Filter"}
        </ButtonWithStatus>

        {(tableState?.filters ?? []).map((filter) => (
          <Chip
            key={filter.key}
            label={`${filter.key} ${filter.operator} ${filter.value}`}
            onDelete={() => handleUpdateFilters([])}
            classes={{
              root: classes.filterChip,
              label: classes.filterChipLabel,
            }}
            variant="outlined"
          />
        ))}
      </Grid>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        classes={{ paper: classes.paper }}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <IconButton className={classes.closeButton} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
        <div className={classes.content}>
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
                disabled={!query.key || operators?.length === 0}
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
                {operators.map((operator) => (
                  <MenuItem key={operator.value} value={operator.value}>
                    {operator.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              {/* {query.operator&&React.createElement(filter.input,{
              handleChange: (value) => setQuery((query) => ({
                  ...query,
                  value,
                }))
              ,
              key: query.key,
            },null)} */}

              {customFieldInput &&
                React.createElement(customFieldInput, {
                  column: selectedColumn,
                  control,
                  docRef: {},
                  disabled: false,
                })}
            </Grid>
          </Grid>
          <Grid
            container
            className={classes.bottomButtons}
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
                  typeof query.value !== "number"
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
};
export default Filters;
