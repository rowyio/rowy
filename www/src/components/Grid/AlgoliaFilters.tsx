import React, { useState, useEffect } from "react";
import { SearchIndex } from "algoliasearch/lite";
import { FacetHit } from "@algolia/client-search";
import useAlgolia from "use-algolia";
import { useDebouncedCallback } from "use-debounce";

import {
  makeStyles,
  createStyles,
  Grid,
  Typography,
  Button,
  TextField,
  InputAdornment,
  ListItemSecondaryAction,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import MultiSelect from "@antlerengineering/multiselect";

const useStyles = makeStyles((theme) =>
  createStyles({
    resetFilters: { marginRight: -theme.spacing(1) },

    filterGrid: {
      marginTop: 0,
      marginBottom: theme.spacing(3),
    },

    listItemText: { whiteSpace: "pre-line" },
    count: {
      position: "static",
      marginLeft: "auto",
      paddingLeft: theme.spacing(1.5),
      transform: "none",
      color: theme.palette.text.disabled,
    },
  })
);

/**
 * Generates the string to dispatch as filters for the query
 * @param filterValues The user-selected filters
 * @param requiredFilters Filters not selected by the user
 */
const generateFiltersString = (
  filterValues: Record<string, string[]>,
  requiredFilters?: string
) => {
  if (Object.keys(filterValues).length === 0) return null;

  let filtersString = Object.entries(filterValues)
    .filter(([, values]) => values.length > 0)
    .map(
      ([facet, values]) =>
        `(${values
          .map((value) => `${facet}:"${value.replace(/"/g, '\\"')}"`)
          .join(" OR ")})`
    )
    .join(" AND ");

  if (requiredFilters) {
    if (filtersString)
      filtersString = requiredFilters + " AND " + filtersString;
    else filtersString = requiredFilters;
  }

  return filtersString;
};

export interface IAlgoliaFiltersProps {
  index: SearchIndex;
  request: ReturnType<typeof useAlgolia>[0]["request"];
  requestDispatch: ReturnType<typeof useAlgolia>[1];
  requiredFilters?: string;
  label: string;
  filters: {
    label: string;
    facet: string;
    labelTransformer?: (value: string) => string;
  }[];
  search?: boolean;
}

export default function AlgoliaFilters({
  index,
  request,
  requestDispatch,
  requiredFilters,
  label,
  filters,
  search = true,
}: IAlgoliaFiltersProps) {
  const classes = useStyles();

  // Store filter values
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>(
    {}
  );
  // Push filter values to dispatch
  useEffect(() => {
    const filtersString = generateFiltersString(filterValues, requiredFilters);
    if (filtersString === null) return;
    requestDispatch({ filters: filtersString });
  }, [filterValues]);

  // Store facet values
  const [facetValues, setFacetValues] = useState<
    Record<string, readonly FacetHit[]>
  >({});
  // Get facet values
  useEffect(() => {
    if (!index) return;

    filters.forEach((filter) => {
      const params = { ...request, maxFacetHits: 100 };
      // Ignore current user-selected value for these filters so all options
      // continue to show up
      params.filters =
        generateFiltersString(
          { ...filterValues, [filter.facet]: [] },
          requiredFilters
        ) ?? "";

      index
        .searchForFacetValues(filter.facet, "", params)
        .then(({ facetHits }) =>
          setFacetValues((other) => ({ ...other, [filter.facet]: facetHits }))
        );
    });
  }, [filters, index, filterValues, requiredFilters]);

  // Reset filters
  const handleResetFilters = () => {
    setFilterValues({});
    setQuery("");
    requestDispatch({ filters: requiredFilters ?? "", query: "" });
  };

  // Store search query
  const [query, setQuery] = useState("");
  const [handleQueryChange] = useDebouncedCallback(
    (query: string) => requestDispatch({ query }),
    500
  );

  return (
    <div>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs>
          <Typography variant="overline">
            Filter{label ? " " + label : "s"}
          </Typography>
        </Grid>

        <Grid item>
          <Button
            color="primary"
            onClick={handleResetFilters}
            className={classes.resetFilters}
            disabled={query === "" && Object.keys(filterValues).length === 0}
          >
            Reset Filters
          </Button>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        alignItems="center"
        className={classes.filterGrid}
      >
        {search && (
          <Grid item xs={12} md={4} lg={3}>
            <TextField
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                handleQueryChange(e.target.value);
              }}
              variant="filled"
              type="search"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              aria-label={`Search${label ? " " + label : ""}`}
              placeholder={`Search${label ? " " + label : ""}`}
              hiddenLabel
              fullWidth
            />
          </Grid>
        )}

        {filters.map((filter) => (
          <Grid item key={filter.facet} xs={12} sm={6} md={4} lg={3}>
            <MultiSelect
              label={filter.label}
              value={filterValues[filter.facet] ?? []}
              onChange={(value) =>
                setFilterValues((other) => ({
                  ...other,
                  [filter.facet]: value,
                }))
              }
              options={
                facetValues[filter.facet]?.map((item) => ({
                  value: item.value,
                  label: filter.labelTransformer
                    ? filter.labelTransformer(item.value)
                    : item.value,
                  count: item.count,
                })) ?? []
              }
              itemRenderer={(option) => (
                <React.Fragment key={option.value}>
                  {option.label}
                  <ListItemSecondaryAction className={classes.count}>
                    <Typography
                      variant="body2"
                      color="inherit"
                      component="span"
                    >
                      {(option as any).count}
                    </Typography>
                  </ListItemSecondaryAction>
                </React.Fragment>
              )}
              searchable={facetValues[filter.facet]?.length > 10}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
