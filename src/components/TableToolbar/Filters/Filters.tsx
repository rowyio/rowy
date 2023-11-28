import { useState, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import useMemoValue from "use-memo-value";
import { isEmpty, isDate } from "lodash-es";

import {
  Tab,
  Badge,
  Button,
  Stack,
  Divider,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import FiltersPopover from "./FiltersPopover";
import FilterInputsCollection from "./FilterInputsCollection";

import {
  projectScope,
  userSettingsAtom,
  updateUserSettingsAtom,
  userRolesAtom,
} from "@src/atoms/projectScope";
import {
  tableScope,
  tableIdAtom,
  tableSchemaAtom,
  tableColumnsOrderedAtom,
  tableFiltersAtom,
  tableSortsAtom,
  updateTableSchemaAtom,
  tableFiltersPopoverAtom,
  tableFiltersJoinAtom,
} from "@src/atoms/tableScope";
import { useFilterInputs } from "./useFilterInputs";
import { analytics, logEvent } from "@src/analytics";
import type { TableFilter } from "@src/types/table";
import { generateId } from "@src/utils/table";
import { useFilterUrl } from "./useFilterUrl";
import { isEqual } from "lodash-es";

const shouldDisableApplyButton = (queries: any) => {
  for (let query of queries) {
    if (query.operator === "is-empty" || query.operator === "is-not-empty") {
      continue;
    }

    if (
      isEmpty(query.value) &&
      !isDate(query.value) &&
      typeof query.value !== "boolean" &&
      typeof query.value !== "number"
    )
      return true;
  }

  return false;
};

enum FilterType {
  yourFilter = "local_filter",
  tableFilter = "table_filter",
}

export default function Filters() {
  const [userSettings] = useAtom(userSettingsAtom, projectScope);
  const [updateUserSettings] = useAtom(updateUserSettingsAtom, projectScope);
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  const [localFilters, setLocalFilters] = useAtom(tableFiltersAtom, tableScope);
  const [, setTableSorts] = useAtom(tableSortsAtom, tableScope);
  const [updateTableSchema] = useAtom(updateTableSchemaAtom, tableScope);
  const [{ defaultQuery }] = useAtom(tableFiltersPopoverAtom, tableScope);

  const tableFilterInputs = useFilterInputs(tableColumnsOrdered);
  const setTableQueries = tableFilterInputs.setQueries;
  const userFilterInputs = useFilterInputs(tableColumnsOrdered, defaultQuery);
  const setUserQueries = userFilterInputs.setQueries;
  const { availableFiltersForEachSelectedColumn } = userFilterInputs;
  const availableFiltersForFirstColumn =
    availableFiltersForEachSelectedColumn[0];

  const setTableFiltersJoin = useSetAtom(tableFiltersJoinAtom, tableScope);

  // Get table filters & user filters from config documents
  const tableFilters = useMemoValue(
    tableSchema.filters,
    (next, prev) => JSON.stringify(next) === JSON.stringify(prev)
  );
  const tableFiltersOverridable = Boolean(tableSchema.filtersOverridable);
  const userFilters = tableId
    ? userSettings.tables?.[tableId]?.filters
    : undefined;
  // Helper booleans
  const hasTableFilters =
    Array.isArray(tableFilters) && tableFilters.length > 0;
  const hasUserFilters = Array.isArray(userFilters) && userFilters.length > 0;

  // Set the local table filter
  useEffect(() => {
    // Set local state for UI
    if (
      Array.isArray(tableFilters) &&
      tableFilters &&
      tableFilters.length > 0
    ) {
      // Older filters do not have ID. Migrating them here.
      for (const filter of tableFilters) {
        if (!filter.id) filter.id = generateId();
      }
      setTableQueries(tableFilters);
    }

    if (Array.isArray(userFilters) && userFilters && userFilters.length > 0) {
      // Older filters do not have ID. Migrating them here.
      for (const filter of userFilters) {
        if (!filter.id) filter.id = generateId();
      }
      setUserQueries(userFilters);
    }

    setCanOverrideCheckbox(tableFiltersOverridable);

    let filtersToApply: TableFilter[] = [];

    // Allow override table-level filters with their own
    // Set to null to completely ignore table filters
    if (tableFiltersOverridable && (hasUserFilters || userFilters === null)) {
      filtersToApply = userFilters ?? [];
    } else if (hasTableFilters) {
      filtersToApply = tableFilters;
    } else if (hasUserFilters) {
      filtersToApply = userFilters;
    }

    setLocalFilters(filtersToApply);
    // Reset order so we don’t have to make a new index
    if (filtersToApply.length) {
      setTableSorts([]);
    }
  }, [
    hasTableFilters,
    hasUserFilters,
    setLocalFilters,
    setTableSorts,
    setTableQueries,
    tableFilters,
    tableFiltersOverridable,
    setUserQueries,
    userFilters,
    userRoles,
  ]);

  // Helper booleans for local table filter state
  const appliedFilters = localFilters;
  const hasAppliedFilters = Boolean(
    appliedFilters && appliedFilters.length > 0
  );
  const tableFiltersOverridden =
    (tableFiltersOverridable || userRoles.includes("ADMIN")) &&
    (hasUserFilters || userFilters === null) &&
    hasTableFilters;

  // Override table filters
  const [canOverrideCheckbox, setCanOverrideCheckbox] = useState(
    tableFiltersOverridable
  );
  const [tab, setTab] = useState<"user" | "table">(
    hasTableFilters && !tableFiltersOverridden && !defaultQuery
      ? "table"
      : "user"
  );

  // When defaultQuery (from atom) is updated, update the UI
  useEffect(() => {
    if (defaultQuery) {
      setUserQueries([defaultQuery]);
      setTab("user");
    }
  }, [setUserQueries, defaultQuery]);

  const [overrideTableFilters, setOverrideTableFilters] = useState(
    tableFiltersOverridden
  );

  useEffect(() => {
    if (userSettings.tables?.[tableId]?.joinOperator) {
      userFilterInputs.setJoinOperator(
        userSettings.tables?.[tableId]?.joinOperator === "AND" ? "AND" : "OR"
      );
    }

    if (tableSchema.joinOperator) {
      tableFilterInputs.setJoinOperator(
        tableSchema.joinOperator === "AND" ? "AND" : "OR"
      );
    }
  }, [userSettings.tables?.[tableId]?.joinOperator, tableSchema.joinOperator]);

  useEffect(() => {
    if (tableFiltersOverridable && (hasUserFilters || userFilters === null)) {
      setTableFiltersJoin(
        userSettings.tables?.[tableId]?.joinOperator === "AND" ? "AND" : "OR"
      );
    } else if (hasTableFilters) {
      setTableFiltersJoin(tableSchema.joinOperator === "AND" ? "AND" : "OR");
    } else if (hasUserFilters) {
      setTableFiltersJoin(
        userSettings.tables?.[tableId]?.joinOperator === "AND" ? "AND" : "OR"
      );
    }
  }, [
    tableFiltersOverridable,
    hasUserFilters,
    hasTableFilters,
    userFilters,
    tableSchema.joinOperator,
    userSettings.tables?.[tableId]?.joinOperator,
  ]);

  // Save table filters to table schema document
  const setTableFilters = (
    filters: TableFilter[],
    op: "AND" | "OR" = "AND"
  ) => {
    logEvent(analytics, FilterType.tableFilter);
    if (updateTableSchema)
      updateTableSchema({
        filters,
        filtersOverridable: canOverrideCheckbox,
        joinOperator: op,
      });
  };
  // Save user filters to user document
  // null overrides table filters
  const setUserFilters = (
    filters: TableFilter[] | null,
    op: "AND" | "OR" = "AND"
  ) => {
    logEvent(analytics, FilterType.yourFilter);
    if (updateUserSettings && filters)
      updateUserSettings({
        tables: { [`${tableId}`]: { filters, joinOperator: op } },
      });
  };

  const { filtersUrl, updateFilterQueryParam } = useFilterUrl();

  // If the filter in URL is not the same as currently applied local filter
  // then update the user filter.
  useEffect(() => {
    if (filtersUrl && !isEqual(filtersUrl, appliedFilters)) {
      setUserFilters(filtersUrl);
      setOverrideTableFilters(true);
    }
  }, [filtersUrl]);

  // Update queyy param if the locally applied filter changes
  useEffect(() => {
    if (appliedFilters) {
      updateFilterQueryParam(appliedFilters);
    }
  }, [appliedFilters]);

  return (
    <FiltersPopover
      appliedFilters={appliedFilters}
      hasAppliedFilters={hasAppliedFilters}
      hasTableFilters={hasTableFilters}
      tableFiltersOverridden={tableFiltersOverridden}
      availableFilters={availableFiltersForFirstColumn}
      setUserFilters={setUserFilters}
    >
      {({ handleClose }) => {
        // ADMIN
        if (userRoles.includes("ADMIN")) {
          return (
            <TabContext value={tab}>
              <TabList
                onChange={(_, v) => setTab(v)}
                variant="fullWidth"
                aria-label="Filter tabs"
              >
                <Tab
                  label={
                    <>
                      Your filter
                      {tableFiltersOverridden && (
                        <Badge
                          aria-label="(overrides table filters)"
                          color="primary"
                          variant="inlineDot"
                          invisible={false}
                        />
                      )}
                    </>
                  }
                  value="user"
                  style={{ flexDirection: "row" }}
                />
                <Tab
                  label={
                    <>
                      Table filter
                      {tableFiltersOverridden ? (
                        <Badge
                          aria-label="(overridden by your filters)"
                          color="primary"
                          variant="inlineDot"
                          invisible={false}
                          sx={{
                            "& .MuiBadge-badge": {
                              bgcolor: "transparent",
                              border: "1px solid currentColor",
                              color: "inherit",
                            },
                          }}
                        />
                      ) : hasTableFilters ? (
                        <Badge
                          aria-label="(active)"
                          color="primary"
                          variant="inlineDot"
                          invisible={false}
                        />
                      ) : null}
                    </>
                  }
                  value="table"
                  style={{ flexDirection: "row" }}
                />
              </TabList>
              <Divider style={{ marginTop: -1 }} />

              <TabPanel value="user" className="content">
                <FilterInputsCollection {...userFilterInputs} />

                {hasTableFilters && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={overrideTableFilters}
                        onChange={(e) =>
                          setOverrideTableFilters(e.target.checked)
                        }
                      />
                    }
                    label="Override table filters"
                    sx={{ justifyContent: "center", mb: 1, mr: 0 }}
                  />
                )}

                <Stack
                  direction="row"
                  sx={{ "& .MuiButton-root": { minWidth: 100 } }}
                  justifyContent="center"
                  spacing={1}
                >
                  <Button
                    disabled={
                      (!overrideTableFilters && hasTableFilters) ||
                      userFilterInputs.queries.length === 0
                    }
                    onClick={() => {
                      setUserFilters([]);
                      userFilterInputs.resetQuery();
                    }}
                  >
                    Clear All
                  </Button>

                  <Button
                    disabled={
                      (!overrideTableFilters && hasTableFilters) ||
                      shouldDisableApplyButton(userFilterInputs.queries)
                    }
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      setUserFilters(
                        userFilterInputs.queries as TableFilter[],
                        userFilterInputs.joinOperator
                      );
                      handleClose();
                    }}
                  >
                    Apply
                  </Button>
                </Stack>
              </TabPanel>

              <TabPanel value="table" className="content">
                <FilterInputsCollection {...tableFilterInputs} />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={canOverrideCheckbox}
                      onChange={(e) => setCanOverrideCheckbox(e.target.checked)}
                    />
                  }
                  label="All users can override table filters"
                  sx={{ justifyContent: "center", mb: 1, mr: 0 }}
                />

                <Alert severity="info" style={{ width: "auto" }} sx={{ mb: 3 }}>
                  <ul style={{ margin: 0, paddingLeft: "1.5em" }}>
                    <li>
                      The filter above will be set
                      {canOverrideCheckbox && " by default"} for all users who
                      view this table.
                    </li>
                    {canOverrideCheckbox ? (
                      <>
                        <li>All users can override this.</li>
                        <li>Only ADMIN users can edit table filters.</li>
                      </>
                    ) : (
                      <li>Only ADMIN users can override or edit this.</li>
                    )}
                  </ul>
                </Alert>

                <Stack
                  direction="row"
                  sx={{ "& .MuiButton-root": { minWidth: 100 } }}
                  justifyContent="center"
                  spacing={1}
                >
                  <Button
                    disabled={tableFilterInputs.queries.length === 0}
                    onClick={() => {
                      setTableFilters([]);
                      tableFilterInputs.resetQuery();
                    }}
                  >
                    Clear All
                  </Button>

                  <Button
                    disabled={shouldDisableApplyButton(
                      tableFilterInputs.queries
                    )}
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      setTableFilters(
                        tableFilterInputs.queries as TableFilter[],
                        tableFilterInputs.joinOperator
                      );
                      handleClose();
                    }}
                  >
                    Apply
                  </Button>
                </Stack>
              </TabPanel>
            </TabContext>
          );
        }

        // Non-ADMIN, override disabled
        if (hasTableFilters && !tableFiltersOverridable) {
          return (
            <div className="content">
              <FilterInputsCollection {...tableFilterInputs} disabled />

              <Alert severity="info" style={{ width: "auto" }}>
                An ADMIN user has set the filter for this table
              </Alert>
            </div>
          );
        }

        // Non-ADMIN, override enabled
        if (hasTableFilters && tableFiltersOverridable) {
          return (
            <div className="content">
              <FilterInputsCollection {...userFilterInputs} />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={overrideTableFilters}
                    onChange={(e) => setOverrideTableFilters(e.target.checked)}
                  />
                }
                label="Override table filters"
                sx={{ justifyContent: "center", mb: 1, mr: 0 }}
              />

              <Stack
                direction="row"
                sx={{ "& .MuiButton-root": { minWidth: 100 } }}
                justifyContent="center"
                spacing={1}
              >
                <Button
                  disabled={
                    !overrideTableFilters &&
                    !tableFiltersOverridden &&
                    userFilterInputs.queries.length === 0
                  }
                  onClick={() => {
                    setUserFilters([]);
                    userFilterInputs.resetQuery();
                  }}
                >
                  Clear All
                </Button>

                <Button
                  disabled={
                    (!overrideTableFilters && hasTableFilters) ||
                    shouldDisableApplyButton(userFilterInputs.queries)
                  }
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    setUserFilters(
                      userFilterInputs.queries as TableFilter[],
                      userFilterInputs.joinOperator
                    );
                    handleClose();
                  }}
                >
                  Apply
                </Button>
              </Stack>
            </div>
          );
        }

        // Non-ADMIN, no table filters
        return (
          <div className="content">
            <FilterInputsCollection {...userFilterInputs} />

            <Stack
              direction="row"
              sx={{ "& .MuiButton-root": { minWidth: 100 } }}
              justifyContent="center"
              spacing={1}
            >
              <Button
                disabled={userFilterInputs.queries.length === 0}
                onClick={() => {
                  setUserFilters([]);
                  userFilterInputs.resetQuery();
                }}
              >
                Clear All
              </Button>

              <Button
                disabled={shouldDisableApplyButton(userFilterInputs.queries)}
                color="primary"
                variant="contained"
                onClick={() => {
                  setUserFilters(
                    userFilterInputs.queries as TableFilter[],
                    userFilterInputs.joinOperator
                  );
                  handleClose();
                }}
              >
                Apply
              </Button>
            </Stack>
          </div>
        );
      }}
    </FiltersPopover>
  );
}
