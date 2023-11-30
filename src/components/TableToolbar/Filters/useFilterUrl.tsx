import { tableFiltersAtom, tableScope } from "@src/atoms/tableScope";
import { TableFilter } from "@src/types/table";
import { useAtom } from "jotai";
import { isEqual } from "lodash-es";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function isTableFilter(filter: any): filter is TableFilter {
  if (typeof filter !== "object") return false;
  if ("key" in filter === false) return false;
  if ("id" in filter === false) return false;
  if ("value" in filter === false) return false;
  if ("operator" in filter === false) return false;
  return true;
}

/** Hook to manage filter as a query parameter */
export function useFilterUrl() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const [filters, setFilters] = useAtom(tableFiltersAtom, tableScope);

  // Fetch filter from URL and update user filter
  useEffect(() => {
    const filterParam = searchParams.get("filter");

    if (filterParam) {
      try {
        const _filters = JSON.parse(decodeURIComponent(filterParam));

        if (!Array.isArray(_filters))
          throw new Error("Filter should be an array");

        for (const _filter of _filters) {
          if (!isTableFilter(_filter)) throw new Error("Invalid Filter");
        }
        if (!isEqual(_filters, filters)) setFilters(_filters);
      } catch (err) {
        enqueueSnackbar("Oops, filter in URL is incorrect!!!", {
          variant: "error",
        });
      }
    }
  }, [searchParams]);

  const updateFilterQueryParam = (filter: TableFilter[]) => {
    const searchParams = new URLSearchParams(window.location.search);
    if (filter.length === 0) {
      searchParams.delete("filter");
    } else {
      // Due to the nature of searchParams, filter is being encoded twice. Once by
      // encodeURIComponent and then by searchParams. We can't remove encodeURIComponent
      // because searchParams uses application/x-www-form-urlencoded which is not URL safe.
      searchParams.set("filter", encodeURIComponent(JSON.stringify(filter)));
    }
    setSearchParams(searchParams, { replace: true });
  };

  return {
    /** Table filter present as a query param in the URL */
    filtersUrl: filters,
    /** Use this function to update the filter query param */
    updateFilterQueryParam,
  };
}
