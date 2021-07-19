import React, { useState, useEffect } from "react";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";
import _isEmpty from "lodash/isEmpty";

import {
  makeStyles,
  createStyles,
  Popover,
  Button,
  Typography,
  IconButton,
  Grid,
  MenuItem,
  TextField,
  Switch,
  Chip,
} from "@material-ui/core";
import FilterIcon from "@material-ui/icons/FilterList";
import CloseIcon from "@material-ui/icons/Close";

import MultiSelect from "@antlerengineering/multiselect";
import ButtonWithStatus from "components/ButtonWithStatus";

import { FieldType } from "constants/fields";
import { FireTableFilter } from "hooks/useFiretable";
import { useFiretableContext } from "contexts/FiretableContext";

import { useAppContext } from "contexts/AppContext";
import { DocActions } from "hooks/useDoc";
const getType = (column) =>
  column.type === FieldType.derivative
    ? column.config.renderFieldType
    : column.type;
const OPERATORS = [
  {
    value: "==",
    label: "Equals",
    compatibleTypes: [
      FieldType.phone,
      FieldType.color,
      FieldType.date,
      FieldType.dateTime,
      FieldType.shortText,
      FieldType.singleSelect,
      FieldType.url,
      FieldType.email,
      FieldType.checkbox,
    ],
  },
  {
    value: "in",
    label: "matches any of",
    compatibleTypes: [FieldType.singleSelect],
  },
  // {
  //   value: "array-contains",
  //   label: "includes",
  //   compatibleTypes: [FieldType.connectTable],
  // },
  // {
  //   value: "array-contains",
  //   label: "Has",
  //   compatibleTypes: [FieldType.multiSelect],
  // },
  {
    value: "array-contains-any",
    label: "Has any",
    compatibleTypes: [FieldType.multiSelect, FieldType.connectTable],
  },
  { value: "<", label: "<", compatibleTypes: [FieldType.number] },
  { value: "<=", label: "<=", compatibleTypes: [FieldType.number] },
  { value: "==", label: "==", compatibleTypes: [FieldType.number] },
  { value: ">=", label: ">=", compatibleTypes: [FieldType.number] },
  { value: ">", label: ">", compatibleTypes: [FieldType.number] },
  {
    value: "<",
    label: "before",
    compatibleTypes: [FieldType.date, FieldType.dateTime],
  },
  {
    value: ">=",
    label: "after",
    compatibleTypes: [FieldType.date, FieldType.dateTime],
  },
];

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: { width: 640 },

    closeButton: {
      position: "absolute",
      top: theme.spacing(0.5),
      right: theme.spacing(0.5),
    },

    content: { padding: theme.spacing(4) },

    topRow: { marginBottom: theme.spacing(3.5) },
    bottomButtons: { marginTop: theme.spacing(4.5) },

    activeButton: {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },

    filterChip: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      backgroundColor: theme.palette.background.paper,
      marginLeft: -1,
      borderColor: theme.palette.action.disabled,
    },
    filterChipLabel: {
      ...theme.typography.subtitle2,
      lineHeight: 1,
    },
    filterChipDelete: {
      color: theme.palette.primary.main,
      "&:hover": { color: theme.palette.primary.dark },
    },
  })
);

const UNFILTERABLES = [
  FieldType.image,
  FieldType.file,
  FieldType.action,
  FieldType.subTable,
  FieldType.last,
  FieldType.longText,
];
const Filters = () => {
  const { userClaims, tableState, tableActions } = useFiretableContext();
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
    .filter((c) => !UNFILTERABLES.includes(c.type))
    .map((c) => ({
      key: c.key,
      label: c.name,
      type: c.type,
      options: c.options,
      ...c,
    }));
  const classes = useStyles();
  const filters = [];
  const combineType = "all";
  const [selectedColumn, setSelectedColumn] = useState<any>();

  const [query, setQuery] = useState<FireTableFilter>({
    key: "",
    operator: "",
    value: "",
  });

  useEffect(() => {
    if (selectedColumn) {
      let updatedQuery: FireTableFilter = {
        key: selectedColumn.key,
        operator: "",
        value: "",
      };
      const type = getType(selectedColumn);
      if (
        [
          FieldType.phone,
          FieldType.shortText,
          FieldType.url,
          FieldType.email,
          FieldType.checkbox,
        ].includes(type)
      ) {
        updatedQuery = { ...updatedQuery, operator: "==" };
      }
      if (type === FieldType.checkbox) {
        updatedQuery = { ...updatedQuery, value: false };
      }
      if (type === FieldType.connectTable) {
        updatedQuery = {
          key: `${selectedColumn.key}ID`,
          operator: "array-contains-any",
          value: [],
        };
      }
      if (type === FieldType.multiSelect) {
        updatedQuery = {
          ...updatedQuery,
          operator: "array-contains-any",
          value: [],
        };
      }
      setQuery(updatedQuery);
    }
  }, [selectedColumn]);

  const operators = selectedColumn
    ? OPERATORS.filter((operator) =>
        operator.compatibleTypes.includes(getType(selectedColumn))
      )
    : [];

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

  const renderInputField = (selectedColumn, operator) => {
    const type = getType(selectedColumn);
    switch (type) {
      case FieldType.checkbox:
        return (
          <Switch
            value={query.value}
            onChange={(e, checked) => {
              setQuery((query) => ({ ...query, value: checked }));
            }}
          />
        );
      case FieldType.email:
      case FieldType.phone:
      case FieldType.shortText:
      case FieldType.longText:
      case FieldType.url:
        return (
          <TextField
            onChange={(e) => {
              const value = e.target.value;
              if (value) setQuery((query) => ({ ...query, value: value }));
            }}
            variant="filled"
            hiddenLabel
            placeholder="Text value"
          />
        );
      case FieldType.number:
        return (
          <TextField
            onChange={(e) => {
              const value = e.target.value;
              if (query.value || value)
                setQuery((query) => ({
                  ...query,
                  value: value !== "" ? parseFloat(value) : "",
                }));
            }}
            value={typeof query.value === "number" ? query.value : ""}
            variant="filled"
            hiddenLabel
            type="number"
            placeholder="number value"
          />
        );

      case FieldType.singleSelect:
        if (operator === "in")
          return (
            <MultiSelect
              multiple
              max={10}
              freeText={true}
              onChange={(value) => setQuery((query) => ({ ...query, value }))}
              options={
                selectedColumn.config.options
                  ? selectedColumn.config.options.sort()
                  : []
              }
              label=""
              value={Array.isArray(query?.value) ? query.value : []}
              TextFieldProps={{ hiddenLabel: true }}
            />
          );

        return (
          <MultiSelect
            freeText={true}
            multiple={false}
            onChange={(value) => {
              if (value !== null) setQuery((query) => ({ ...query, value }));
            }}
            options={
              selectedColumn.config.options
                ? selectedColumn.config.options.sort()
                : []
            }
            label=""
            value={typeof query?.value === "string" ? query.value : null}
            TextFieldProps={{ hiddenLabel: true }}
          />
        );

      case FieldType.multiSelect:
        return (
          <MultiSelect
            multiple
            onChange={(value) => setQuery((query) => ({ ...query, value }))}
            value={query.value as string[]}
            max={10}
            options={
              selectedColumn.config.options
                ? selectedColumn.config.options.sort()
                : []
            }
            label={""}
            searchable={false}
            freeText={true}
          />
        );

      case FieldType.date:
      case FieldType.dateTime:
        return <>//TODO:Date/Time picker</>;
      default:
        return <>Not available</>;
        // return <TextField variant="filled" fullWidth disabled />;
        break;
    }
  };

  const handleUpdateFilters = (filters: FireTableFilter[]) => {
    userDoc.dispatch({
      action: DocActions.update,
      data: {
        tables: { [`${tableState?.tablePath}`]: { filters } },
      },
    });
  };
  return (
    <>
      <Grid container direction="row" wrap="nowrap">
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
              deleteIcon: classes.filterChipDelete,
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
          {/* <Grid
            container
            alignItems="center"
            spacing={2}
            className={classes.topRow}
          >
            <Grid item>
              <Typography component="span">Results match</Typography>
            </Grid>

            <Grid item>
              <TextField
                select
                variant="filled"
                id="demo-simple-select-filled"
                value={combineType}
                hiddenLabel
                // disabled
                // onChange={handleChange}
              >
                <MenuItem value="all">all</MenuItem>
                <MenuItem value="any">any</MenuItem>
              </TextField>
            </Grid>

            <Grid item>
              <Typography component="span">of the filter criteria.</Typography>
            </Grid>
          </Grid> */}

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="overline">Column</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="overline">Condition</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="overline">Value</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                select
                variant="filled"
                hiddenLabel
                fullWidth
                value={selectedColumn?.key ?? ""}
                onChange={handleChangeColumn}
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem disabled value="" style={{ display: "none" }}>
                  Select Column
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
                  Select Condition
                </MenuItem>
                {operators.map((operator) => (
                  <MenuItem key={operator.value} value={operator.value}>
                    {operator.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={4}>
              {query.operator &&
                renderInputField(selectedColumn, query.operator)}
            </Grid>
          </Grid>

          <Grid
            container
            className={classes.bottomButtons}
            justify="space-between"
          >
            {/* <Button color="primary">+ ADD FILTER</Button> */}
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
                //handleClose();
              }}
            >
              Clear
            </Button>
            <Button
              disabled={
                query.value !== true &&
                query.value !== false &&
                _isEmpty(query.value) &&
                typeof query.value !== "number"
              }
              color="primary"
              onClick={() => {
                handleUpdateFilters([query]);
                handleClose();
              }}
            >
              Apply
            </Button>
          </Grid>
        </div>
      </Popover>
    </>
  );
};

export default Filters;
