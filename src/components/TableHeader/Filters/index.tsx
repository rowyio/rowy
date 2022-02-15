import { useState, useEffect } from "react";
import _isEmpty from "lodash/isEmpty";

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
import FilterInputs from "./FilterInputs";

import { useFilterInputs, INITIAL_QUERY } from "./useFilterInputs";
import { analytics } from "@src/analytics";
import type { TableFilter } from "@src/hooks/useTable";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { useAppContext } from "@src/contexts/AppContext";
import { DocActions } from "@src/hooks/useDoc";

const shouldDisableApplyButton = (value: any) =>
  _isEmpty(value) &&
  typeof value !== "boolean" &&
  typeof value !== "number" &&
  typeof value !== "object";

enum FilterType {
  yourFilter = "local_filter",
  tableFilter = "table_filter",
}

export default function Filters() {
  const { table, tableState, tableActions } = useProjectContext();
  const { userDoc, userClaims } = useAppContext();

  const tableFilterInputs = useFilterInputs(tableState?.columns || []);
  const userFilterInputs = useFilterInputs(tableState?.columns || []);
  const { availableFilters } = userFilterInputs;

  // Get table filters & user filters from config documents
  const tableId = table?.id;
  const userDocData = userDoc.state.doc;
  const tableSchemaDoc = tableState?.config?.tableConfig?.doc;
  const tableFilters = tableSchemaDoc?.filters;
  const tableFiltersOverridable = Boolean(tableSchemaDoc?.filtersOverridable);
  const userFilters = tableId
    ? userDocData.tables?.[tableId]?.filters
    : undefined;
  // Helper booleans
  const hasTableFilters =
    Array.isArray(tableFilters) && tableFilters.length > 0;
  const hasUserFilters = Array.isArray(userFilters) && userFilters.length > 0;

  // Set the local table filter
  useEffect(() => {
    // Set local state for UI
    tableFilterInputs.setQuery(
      Array.isArray(tableFilters) && tableFilters[0]
        ? tableFilters[0]
        : INITIAL_QUERY
    );
    userFilterInputs.setQuery(
      Array.isArray(userFilters) && userFilters[0]
        ? userFilters[0]
        : INITIAL_QUERY
    );
    setCanOverrideCheckbox(tableFiltersOverridable);

    if (!tableActions) return;

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

    tableActions.table.filter(filtersToApply);
    // Reset order so we don’t have to make a new index
    tableActions.table.orderBy();
  }, [tableFilters, tableFiltersOverridable, userFilters, userClaims?.roles]);

  // Helper booleans for local table filter state
  const appliedFilters = tableState?.filters || [];
  const hasAppliedFilters = Boolean(
    appliedFilters && appliedFilters.length > 0
  );
  const tableFiltersOverridden =
    (tableFiltersOverridable || userClaims?.roles.includes("ADMIN")) &&
    (hasUserFilters || userFilters === null) &&
    hasTableFilters;

  // Override table filters
  const [canOverrideCheckbox, setCanOverrideCheckbox] = useState(
    tableFiltersOverridable
  );
  const [tab, setTab] = useState<"user" | "table">(
    hasTableFilters && !tableFiltersOverridden ? "table" : "user"
  );
  const [overrideTableFilters, setOverrideTableFilters] = useState(
    tableFiltersOverridden
  );

  // Save table filters to table schema document
  const setTableFilters = (filters: TableFilter[]) => {
    analytics.logEvent(FilterType.tableFilter);
    tableActions?.table.updateConfig("filters", filters);
    tableActions?.table.updateConfig("filtersOverridable", canOverrideCheckbox);
  };
  // Save user filters to user document
  // null overrides table filters
  const setUserFilters = (filters: TableFilter[] | null) => {
    analytics.logEvent(FilterType.yourFilter);
    userDoc.dispatch({
      action: DocActions.update,
      data: {
        tables: { [`${tableState?.config.id}`]: { filters } },
      },
    });
  };

  return (
    <FiltersPopover
      appliedFilters={appliedFilters}
      hasAppliedFilters={hasAppliedFilters}
      hasTableFilters={hasTableFilters}
      tableFiltersOverridden={tableFiltersOverridden}
      availableFilters={availableFilters}
      setUserFilters={setUserFilters}
    >
      {({ handleClose }) => {
        // ADMIN
        if (userClaims?.roles.includes("ADMIN")) {
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
                <FilterInputs {...userFilterInputs} />

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
                      !overrideTableFilters &&
                      !tableFiltersOverridden &&
                      userFilterInputs.query.key === ""
                    }
                    onClick={() => {
                      setUserFilters(overrideTableFilters ? null : []);
                      userFilterInputs.resetQuery();
                    }}
                  >
                    Clear
                    {hasTableFilters &&
                      (overrideTableFilters
                        ? " (ignore table filter)"
                        : " (use table filter)")}
                  </Button>

                  <Button
                    disabled={
                      (!overrideTableFilters && hasTableFilters) ||
                      shouldDisableApplyButton(userFilterInputs.query.value)
                    }
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      setUserFilters([userFilterInputs.query]);
                      handleClose();
                    }}
                  >
                    Apply
                  </Button>
                </Stack>
              </TabPanel>

              <TabPanel value="table" className="content">
                <FilterInputs {...tableFilterInputs} />

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
                    disabled={tableFilterInputs.query.key === ""}
                    onClick={() => {
                      setTableFilters([]);
                      tableFilterInputs.resetQuery();
                    }}
                  >
                    Clear
                  </Button>

                  <Button
                    disabled={shouldDisableApplyButton(
                      tableFilterInputs.query.value
                    )}
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      setTableFilters([tableFilterInputs.query]);
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
              <FilterInputs {...tableFilterInputs} disabled />

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
              <FilterInputs {...userFilterInputs} />

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
                    userFilterInputs.query.key === ""
                  }
                  onClick={() => {
                    setUserFilters(overrideTableFilters ? null : []);
                    userFilterInputs.resetQuery();
                  }}
                >
                  Clear
                  {overrideTableFilters
                    ? " (ignore table filter)"
                    : " (use table filter)"}
                </Button>

                <Button
                  disabled={
                    (!overrideTableFilters && hasTableFilters) ||
                    shouldDisableApplyButton(userFilterInputs.query.value)
                  }
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    setUserFilters([userFilterInputs.query]);
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
            <FilterInputs {...userFilterInputs} />

            <Stack
              direction="row"
              sx={{ "& .MuiButton-root": { minWidth: 100 } }}
              justifyContent="center"
              spacing={1}
            >
              <Button
                disabled={userFilterInputs.query.key === ""}
                onClick={() => {
                  setUserFilters([]);
                  userFilterInputs.resetQuery();
                }}
              >
                Clear
              </Button>

              <Button
                disabled={shouldDisableApplyButton(
                  userFilterInputs.query.value
                )}
                color="primary"
                variant="contained"
                onClick={() => {
                  setUserFilters([userFilterInputs.query]);
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
