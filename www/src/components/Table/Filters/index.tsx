import React, { useState, useEffect } from "react";
import { FieldType } from "../../Fields";
import {
  Button,
  Paper,
  Typography,
  IconButton,
  FormControl,
  Grid,
  Select,
  MenuItem,
  TextField,
} from "@material-ui/core";
import _find from "lodash/find";
import FilterIcon from "@material-ui/icons/FilterList";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import CloseIcon from "@material-ui/icons/Close";
import { FireTableFilter } from "../../../hooks/useFiretable";
import MultiSelect from "../../MultiSelect";

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      width: 640,
    },
    close: {
      position: "absolute",
      right: 0,
    },
    content: {
      padding: theme.spacing(3),
    },
    formControl: {},
    filterType: {
      display: "flex",
      alignContent: "center",
    },
    filterTypeSelect: {
      margin: theme.spacing(0, 1),
      // height: 50,
    },
    footer: {
      position: "absolute",
      bottom: 0,
    },
  })
);

const Filters = ({ columns, tableFilters, setFilters }: any) => {
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
          />
        );
      default:
        break;
    }
  };
  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleClick}>
        <FilterIcon /> {filters.length !== 0 && filters.length}
        {` Filters`}
      </Button>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <Paper className={classes.paper}>
          <IconButton
            className={classes.close}
            onClick={() => {
              setAnchorEl(null);
            }}
          >
            <CloseIcon />
          </IconButton>
          <div className={classes.content}>
            {/* <div className={classes.filterType}>
              <Typography>Results match </Typography>
              <FormControl variant="filled" className={classes.formControl}>
                <Select
                  className={classes.filterTypeSelect}
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  value={combineType}
                  disabled
                  // onChange={handleChange}
                >
                  <MenuItem value={"all"}>all</MenuItem>
                  <MenuItem value={"any"}>any</MenuItem>
                </Select>
              </FormControl>
              <Typography>of the filter criteria.</Typography>
            </div> */}

            <Grid container>
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

            <Grid container>
              <Grid item xs={4}>
                <FormControl
                  variant="filled"
                  className={classes.formControl}
                  fullWidth
                >
                  <Select
                    className={classes.filterTypeSelect}
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={selectedColumn?.key}
                    onChange={handleChangeColumn}
                  >
                    {filterColumns.map(c => (
                      <MenuItem value={c.key}>{c.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                {query.key && (
                  <FormControl
                    fullWidth
                    variant="filled"
                    className={classes.formControl}
                  >
                    <Select
                      className={classes.filterTypeSelect}
                      labelId="demo-simple-select-filled-label"
                      id="demo-simple-select-filled"
                      value={query.operator}
                      disabled={operators?.length <= 1}
                      onChange={e => {
                        setQuery(query => ({
                          ...query,
                          operator: e.target.value as string,
                        }));
                      }}
                    >
                      {operators.map(operator => (
                        <MenuItem value={operator.value}>
                          {operator.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Grid>
              <Grid item xs={4}>
                {query.operator &&
                  renderInputField(selectedColumn, query.operator)}
              </Grid>
            </Grid>
            <Grid container justify="space-between" className={classes.footer}>
              {/* <Button color="primary">+ ADD FILTER</Button> */}
              <Button
                color="primary"
                onClick={() => {
                  setFilters([query]);
                  setAnchorEl(null);
                }}
              >
                APPLY
              </Button>
            </Grid>
          </div>
        </Paper>
      </Popper>
    </>
  );
};

export default Filters;
