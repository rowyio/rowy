import React, { useState, useEffect } from "react";
import _find from "lodash/find";

import {
  makeStyles,
  createStyles,
  Popover,
  Button,
  Typography,
  IconButton,
  FormControl,
  Grid,
  Select,
  MenuItem,
  TextField,
} from "@material-ui/core";
import FilterIcon from "@material-ui/icons/FilterList";
import CloseIcon from "@material-ui/icons/Close";

import MultiSelect from "../../MultiSelect";

import { FieldType } from "../../Fields";
import { FireTableFilter } from "../../../hooks/useFiretable";

const OPERATORS = [
  {
    value: "==",
    label: "Equals",
    compatibleTypes: [
      FieldType.PhoneNumber,
      FieldType.color,
      FieldType.date,
      FieldType.dateTime,
      FieldType.simpleText,
      FieldType.singleSelect,
      FieldType.url,
      FieldType.email,
    ],
  },
  {
    value: "in",
    label: "matches any of",
    compatibleTypes: [FieldType.singleSelect],
  },
  {
    value: "array-contains",
    label: "Has",
    compatibleTypes: [FieldType.multiSelect],
  },
  {
    value: "array-contains-any",
    label: "Has any",
    compatibleTypes: [FieldType.multiSelect],
  },
  { value: "<", label: "<", compatibleTypes: [FieldType.number] },
  { value: "<=", label: "<=", compatibleTypes: [FieldType.number] },
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

const useStyles = makeStyles(theme =>
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
  })
);

const Filters = ({ columns, setFilters }: any) => {
  //const filters = [{}, {}];

  const filterColumns = columns
    .filter(c => c.type !== FieldType.file && c.type !== FieldType.image)
    .map(c => ({
      key: c.key,
      label: c.name,
      type: c.type,
      options: c.options,
    }));
  filterColumns.pop(); // remove the new column

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
      let updatedQuery = { key: selectedColumn.key, operator: "", value: "" };
      if (
        [
          FieldType.PhoneNumber,
          FieldType.simpleText,
          FieldType.url,
          FieldType.email,
        ].includes(selectedColumn.type)
      ) {
        updatedQuery = { ...updatedQuery, operator: "==" };
      }
      setQuery(updatedQuery);
    }
  }, [selectedColumn]);

  const operators = selectedColumn
    ? OPERATORS.filter(operator =>
        operator.compatibleTypes.includes(selectedColumn.type)
      )
    : [];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClose = () => setAnchorEl(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleChangeColumn = e => {
    const column = _find(filterColumns, c => c.key === e.target.value);
    setSelectedColumn(column);
  };
  const open = Boolean(anchorEl);

  const id = open ? "simple-popper" : undefined;

  const renderInputField = (selectedColumn, operator) => {
    console.log("selectedColumn.fieldType", selectedColumn.type);
    switch (selectedColumn.type) {
      case FieldType.email:
      case FieldType.PhoneNumber:
      case FieldType.simpleText:
      case FieldType.longText:
        return (
          <TextField
            onChange={e => {
              const value = e.target.value;
              if (value) setQuery(query => ({ ...query, value: value }));
            }}
            variant="filled"
            hiddenLabel
            placeholder="Text value"
          />
        );

      case FieldType.singleSelect:
        const val = query?.value
          ? Array.isArray(query.value)
            ? query.value
            : [query.value as string]
          : [];

        return (
          <MultiSelect
            onChange={(fieldName, value) => {
              if (operator === "==")
                setQuery(query => ({ ...query, value: value[0] }));
              else setQuery(query => ({ ...query, value }));
            }}
            options={selectedColumn.options}
            label=""
            field=""
            value={val}
            multiple={operator === "in"}
            TextFieldProps={{ hiddenLabel: true }}
          />
        );

      default:
        return <>Not available</>;
        // return <TextField variant="filled" fullWidth disabled />;
        break;
    }
  };
  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClick}
        startIcon={<FilterIcon />}
      >
        {filters.length !== 0 && filters.length}
        {` Filters`}
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        classes={{ paper: classes.paper }}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
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
                {filterColumns.map(c => (
                  <MenuItem value={c.key}>{c.label}</MenuItem>
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
                onChange={e => {
                  setQuery(query => ({
                    ...query,
                    operator: e.target.value as string,
                  }));
                }}
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem disabled value="" style={{ display: "none" }}>
                  Select Condition
                </MenuItem>
                {operators.map(operator => (
                  <MenuItem value={operator.value}>{operator.label}</MenuItem>
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
              disabled={query.key == ""}
              color="secondary"
              onClick={() => {
                setFilters([]);
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
              disabled={query.value == ""}
              color="primary"
              onClick={() => {
                setFilters([query]);
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
