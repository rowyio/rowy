import { atom } from "jotai";
import { atomWithReducer, atomWithHash } from "jotai/utils";
import {
  findIndex,
  cloneDeep,
  unset,
  orderBy,
  isEmpty,
  get as _get,
  includes,
  isNumber,
  isArray,
  intersection,
  isObject,
  size,
} from "lodash-es";
import {
  isAfter,
  isBefore,
  isMatch,
  isSameDay,
  parse,
  isValid,
} from "date-fns";

import {
  TableSettings,
  TableSchema,
  ColumnConfig,
  TableFilter,
  TableSort,
  TableRow,
  UpdateDocFunction,
  UpdateCollectionDocFunction,
  DeleteCollectionDocFunction,
  NextPageState,
  BulkWriteFunction,
} from "@src/types/table";
import { updateRowData } from "@src/utils/table";
import { Table } from "@tanstack/react-table";

/** Root atom from which others are derived */
export const tableIdAtom = atom("");

export const tableTypeAtom = atom<"db" | "local" | "old">("db");

export const canIncludeLocalDataAtom = atom<boolean>(true);

/** Store tableSettings from project settings document */
export const tableSettingsAtom = atom<TableSettings>({
  id: "",
  collection: "",
  name: "",
  roles: [],
  section: "",
  tableType: "primaryCollection",
});
/** Store tableSchema from schema document */
export const tableSchemaAtom = atom<TableSchema>({});
/** Store function to update tableSchema */
export const updateTableSchemaAtom = atom<
  UpdateDocFunction<TableSchema> | undefined
>(undefined);
/**
 * Store the table columns as an ordered array.
 * Puts frozen columns at the start, then sorts by ascending index.
 */
export const tableColumnsOrderedAtom = atom<ColumnConfig[]>((get) => {
  const tableSchema = get(tableSchemaAtom);
  if (!tableSchema || !tableSchema.columns) return [];
  return orderBy(
    Object.values(tableSchema?.columns ?? {}),
    [(c) => Boolean(c.fixed), "index"],
    ["desc", "asc"]
  );
});
/** Store the table */
export const reactTableAtom = atom<Table<TableRow> | null>(null);
/** Reducer function to convert from array of columns to columns object */
export const tableColumnsReducer = (
  a: Record<string, ColumnConfig>,
  c: ColumnConfig,
  index: number
) => {
  a[c.key] = { ...c, index };
  return a;
};

/** Filters applied to the local view */
export const tableFiltersAtom = atom<TableFilter[]>([]);
/** Join operator applied to mulitple filters */
export const tableFiltersJoinAtom = atom<"AND" | "OR">("AND");
/** Sorts applied to the local view */
export const tableSortsAtom = atom<TableSort[]>([]);

/** Store current page in URL */
export const tablePageHashAtom = atomWithHash("page", 0, {
  replaceState: true,
});
/**
 * Set the page for the table query. Stops updating if we’ve loaded all rows.
 */
export const tablePageAtom = atom(
  (get) => get(tablePageHashAtom),
  (get, set, update: number | ((p: number) => number)) => {
    // If loading more or doesn’t have next page, don’t request another page
    const tableNextPage = get(tableNextPageAtom);
    if (tableNextPage.loading || !tableNextPage.available) return;

    const currentPage = get(tablePageHashAtom);
    set(
      tablePageHashAtom,
      typeof update === "number" ? update : update(currentPage)
    );
  }
);

type TableRowsLocalAction =
  /** Overwrite all rows */
  | { type: "set"; rows: TableRow[] }
  /** Add a row or multiple rows */
  | { type: "add"; row: TableRow | TableRow[] }
  /** Update a row */
  | {
      type: "update";
      path: string;
      row: Partial<TableRow>;
      deleteFields?: string[];
    }
  /** Delete a row or multiple rows */
  | { type: "delete"; path: string | string[] };
const tableRowsLocalReducer = (
  prev: TableRow[],
  action: TableRowsLocalAction
): TableRow[] => {
  switch (action.type) {
    case "set":
      return [...action.rows];

    case "add":
      if (Array.isArray(action.row)) return [...action.row, ...prev];
      return [action.row, ...prev];

    case "update":
      const index = findIndex(prev, ["_rowy_ref.path", action.path]);
      if (index > -1) {
        const updatedRows = [...prev];
        updatedRows[index] = cloneDeep(prev[index]);
        if (Array.isArray(action.deleteFields)) {
          for (const field of action.deleteFields) {
            unset(updatedRows[index], field);
          }
        }
        updatedRows[index] = updateRowData(updatedRows[index], action.row);
        return updatedRows;
      }
      // If not found, add to start
      else {
        return [
          {
            ...action.row,
            _rowy_ref: {
              path: action.path,
              id: action.path.split("/").pop() || action.path,
            },
          },
          ...prev,
        ];
      }

    case "delete":
      return prev.filter((row) => {
        if (Array.isArray(action.path)) {
          return !action.path.includes(row._rowy_ref.path);
        } else {
          return row._rowy_ref.path !== action.path;
        }
      });

    default:
      throw new Error("Invalid action");
  }
};
/**
 * Store rows that are out of order or not ready to be written to the db.
 * See {@link TableRowsLocalAction} for reducer actions.
 */
export const tableRowsLocalAtom = atomWithReducer(
  [] as TableRow[],
  tableRowsLocalReducer
);

/** Store rows from the db listener */
export const tableRowsDbAtom = atom<TableRow[]>([]);

export const possibleFormats = [
  "yyyy-MM-dd",
  "yyyy-MM-dd HH:mm:ss",
  "yyyy-MM-dd HH:mm",
  "yyyy/MM/dd HH:mm:ss",
  "yyyy/MM/dd HH:mm",
  "yyyy/MM/dd",
  "dd/MM/yyyy",
  "MM/dd/yyyy",
  "dd-MM-yyyy",
  "MM-dd-yyyy",
];

const commonEvaluatorTypes = ["email", "phone", "markdown"];

const strictEvaluatorTypes = [
  "json", //costly operations on filters and sorts
  "code", //costly operations on filters and sorts
  "array",
];

const nummericEvaluatorType = [
  "percentage",
  "number",
  "rating",
  "check_box",
  "silder",
];

const dateEvalutorType = [
  "created_by",
  "updated_by",
  "created_at",
  "updated_at",
];

function toArray(value: [] | string | null | undefined) {
  return isArray(value) ? value : [value ?? ""];
}

function hasIntersected(filterValue: [] | string, rowValue: [] | string) {
  if (!filterValue || !rowValue) {
    return false;
  }
  return !isEmpty(intersection(toArray(filterValue), toArray(rowValue)));
}

function stringifyAndCompare(filterValue: [] | string, rowValue: [] | string) {
  return JSON.stringify(toArray(filterValue)).localeCompare(
    JSON.stringify(toArray(rowValue))
  );
}

function strictCheck(filterValue: [] | string, rowValue: [] | string) {
  try {
    return stringifyAndCompare(filterValue, rowValue) === 0;
  } catch (err) {
    return false;
  }
}

export const parseDate = (
  dateString: string | null | undefined | Date,
  format?: string
) => {
  let tempDate = new Date(0);
  if (!dateString) {
    return tempDate;
  }
  if (typeof dateString !== "string") {
    return isValid(dateString) ? dateString : new Date(0);
  }
  let parsedDate;
  if (format && isMatch(dateString, format)) {
    return parse(dateString, format, tempDate);
  }
  for (const tempFormat of possibleFormats) {
    if (isMatch(dateString, tempFormat)) {
      parsedDate = parse(dateString, tempFormat, tempDate);
      break;
    }
  }
  parsedDate = !parsedDate ? new Date(dateString) : parsedDate;
  return parsedDate && isNaN(parsedDate.getTime()) ? tempDate : parsedDate;
};

export const EvaluteFilter = (filter: TableFilter, row: TableRow): boolean => {
  let rowValue = _get(row, filter.key, "");
  let filterValue = filter.value ?? "";
  //handling the numbers with negative and 0 values;
  if (
    filter.operator !== "is-empty" &&
    !isNumber(rowValue) &&
    (isEmpty(rowValue) || isEmpty(filterValue))
  ) {
    return false;
  }
  try {
    if (filter.operator.startsWith("date-")) {
      rowValue = parseDate(rowValue, _get(filter, "format"));
      filterValue = parseDate(filterValue, _get(filter, "format"));
    }
    switch (filter.operator) {
      case "==":
        return strictCheck(filterValue, rowValue);
      case "array-contains":
      case "array-contains-any":
        return hasIntersected(filterValue, rowValue);
      case "!=":
        return !strictCheck(filterValue, rowValue);
      // case "array-not-contains":  return !hasIntersected(filterValue, rowValue);
      case "is-empty":
        return customEmptyCheck(rowValue) || !rowValue;
      case "is-not-empty":
        return !(customEmptyCheck(rowValue) || !rowValue);
      case "date-equal":
        return isSameDay(rowValue, filterValue);
      case "date-before":
        return isBefore(rowValue, filterValue);
      case "date-after":
        return isAfter(rowValue, filterValue);
      case "date-before-equal":
        return (
          isSameDay(rowValue, filterValue) || isBefore(rowValue, filterValue)
        );
      case "date-after-equal":
        return (
          isSameDay(rowValue, filterValue) || isAfter(rowValue, filterValue)
        );
      // case "time-minute-equal": return new Date(rowValue).getTime() <= new Date(filterValue).getTime() ;
      case "id-equal":
        return filterValue && rowValue === filterValue;
    }
  } catch (err) {}

  return false;
};

export const isMetCriteria = (
  row: TableRow,
  tableFilters: TableFilter[],
  tableFiltersJoin: "AND" | "OR"
) => {
  let flag = true;
  for (const filter of tableFilters) {
    if (tableFiltersJoin === "OR" && EvaluteFilter(filter, row)) {
      return true;
    }
    if (tableFiltersJoin === "AND" && !EvaluteFilter(filter, row)) {
      return false;
    }

    flag = tableFiltersJoin === "OR" ? false : true;
  }
  return flag;
};

function getDateValue(date: any) {
  if (!date) {
    return new Date(0);
  }
  if (isValid(date)) {
    return new Date(date);
  }
  if (!!date.toDate) {
    return date.toDate();
  }
  if (isNumber(date)) {
    return new Date(date);
  }
  return new Date(0);
}

function handleGeoData(location1: any, location2: any) {
  if (!location1 && !location2) {
    return 0;
  }
  if (!location1) {
    return -1;
  }
  if (!location2) {
    return 1;
  }
  try {
    return location1._compareTo(location2);
  } catch (err) {
    console.error("error occured while comparing", err);
    return -1;
  }
}

const customEmptyCheck = (value: any) => {
  if (isNumber(value) || value instanceof Date || !!value?.toDate) {
    return false;
  }
  return isObject(value) ? !size(value) : isEmpty(value);
};

function getDuration(durationMeta: Record<string, any>) {
  try {
    const start = getDateValue(durationMeta.start);
    const end = getDateValue(durationMeta.end);
    return start - end;
  } catch (err) {
    return 0;
  }
}

export const customComparator = (
  a: TableRow,
  b: TableRow,
  sortFilters: TableSort[],
  columnsMap: Record<string, ColumnConfig> | undefined
) => {
  let flag = 0;
  for (const { key, direction } of sortFilters) {
    let [aValue, bValue] = [a[key], b[key]];
    const columnMeta = _get(columnsMap, key);

    if (direction?.toLowerCase() === "desc") {
      [aValue, bValue] = [bValue, aValue];
    }
    if (aValue === bValue) {
      continue;
    }
    const isAEmpty = customEmptyCheck(aValue);
    const isBEmpty = customEmptyCheck(bValue);
    if (isAEmpty && isBEmpty) continue;
    if (isAEmpty) return -1;
    if (isBEmpty) return 1;

    const fieldType = _get(columnMeta, "type", "").toLowerCase();
    if (!fieldType) {
      continue;
    }
    switch (true) {
      case fieldType.endsWith("text") ||
        includes(commonEvaluatorTypes, fieldType):
        flag = aValue.localeCompare(bValue);
        break;

      case includes(nummericEvaluatorType, fieldType):
        flag = aValue - bValue;
        break;
      case fieldType.endsWith("_select"):
        flag = stringifyAndCompare(aValue, bValue);
        break; //as select option will have less number of options
      case fieldType.startsWith("date") ||
        includes(dateEvalutorType, fieldType):
        flag = getDateValue(aValue) - getDateValue(bValue);
        break;
      case fieldType === "duration":
        flag = getDuration(aValue) - getDuration(bValue);
        break;
      case fieldType === "color":
        flag = (aValue?.hex ?? "").localCompare(bValue?.hex ?? "");
        break;
      case includes(strictEvaluatorTypes, fieldType):
        stringifyAndCompare(aValue, bValue);
        break;
      case fieldType === "geo_point":
        flag = handleGeoData(aValue, bValue);
    }
    if (flag !== 0) {
      break;
    }
  }
  return flag;
};

function mergeSortedArrays(
  localRows: TableRow[],
  dbRows: TableRow[],
  tableSort: TableSort[],
  columnsMap: Record<string, ColumnConfig> | undefined
) {
  const mergedArray = [];
  let i = 0,
    j = 0;

  while (i < localRows.length && j < dbRows.length) {
    const comparatorValue = customComparator(
      localRows[i],
      dbRows[j],
      tableSort,
      columnsMap
    );
    if (comparatorValue <= 0) {
      mergedArray.push(localRows[i]);
      i++;
    } else {
      mergedArray.push(dbRows[j]);
      j++;
    }
  }

  while (i < localRows.length) {
    mergedArray.push(localRows[i]);
    i++;
  }

  while (j < dbRows.length) {
    mergedArray.push(dbRows[j]);
    j++;
  }

  return mergedArray;
}

function handleFiltersAndSorts(
  rows: TableRow[],
  {
    tableFilters,
    tableSort,
    tableFiltersJoin,
    columnsMap,
  }: {
    tableFilters: TableFilter[];
    tableSort: TableSort[];
    tableFiltersJoin: "AND" | "OR";
    columnsMap?: Record<string, ColumnConfig> | undefined;
  }
) {
  const isTableSortEmpty = isEmpty(tableSort);
  const isTableFilterEmpty = isEmpty(tableFilters);
  if (isTableSortEmpty && isTableFilterEmpty) {
    return rows;
  }
  try {
    rows = rows.filter((row) => {
      //if filters are applied on the table. making sure that local rows were filtered.
      if (!isTableFilterEmpty) {
        return isMetCriteria(row, tableFilters, tableFiltersJoin);
      }
      return true;
    });
    if (!isEmpty(tableSort) && !isEmpty(columnsMap)) {
      rows = rows.sort((a, b) => customComparator(a, b, tableSort, columnsMap));
    }
  } catch (err) {
    console.error("Error occured while handling filters and sorts", err);
  } finally {
    return rows;
  }
}

/** Combine tableRowsLocal and tableRowsDb */
export const tableRowsAtom = atom<TableRow[]>((get) => {
  const tableType = get(tableTypeAtom);
  let tableFilters = get(tableFiltersAtom);
  let tableFiltersJoin = get(tableFiltersJoinAtom);
  let tableSort = get(tableSortsAtom);
  const rowsDb = get(tableRowsDbAtom);
  if (tableType === "db") {
    return [...rowsDb];
  }

  let rowsLocal = get(tableRowsLocalAtom);
  const columnsMap = get(tableSchemaAtom)?.columns;

  // Optimization: create Map of rowsDb by path to index for faster lookup
  const isTableSortEmpty = isEmpty(tableSort);
  const isTableFilterEmpty = isEmpty(tableFilters);
  const isTableColumnMapEmpty = isEmpty(columnsMap);

  const rowsDbMap = new Map<string, number>();
  rowsDb.forEach((row, i) => rowsDbMap.set(row._rowy_ref.path, i));
  // Loop through rowsLocal, which is usually the smaller of the two arrays

  const canIncludeLocalData = get(canIncludeLocalDataAtom);
  if (!canIncludeLocalData && tableType === "old") {
    return [...rowsDb];
  }

  rowsLocal = rowsLocal.map((row) => {
    if (rowsDbMap.has(row._rowy_ref.path)) {
      const index = rowsDbMap.get(row._rowy_ref.path)!;
      const merged = updateRowData({ ...rowsDb[index] }, row);
      //updating the last changes to local rows.
      row = Object.assign(row, merged);
      rowsDbMap.delete(row._rowy_ref.path);
      return merged;
    }
    return row;
  });

  rowsLocal = handleFiltersAndSorts(rowsLocal, {
    tableFilters,
    tableSort,
    tableFiltersJoin,
    columnsMap,
  });

  if (tableType === "local") {
    return [...rowsLocal];
  }

  // Merge the local sorted/filtered rows with db rows.
  if (
    (!isTableSortEmpty || !isTableFilterEmpty) &&
    !isTableColumnMapEmpty &&
    !isEmpty(rowsLocal)
  ) {
    return mergeSortedArrays(
      rowsLocal,
      rowsDb.filter((row) => rowsDbMap.has(row._rowy_ref.path)),
      tableSort,
      columnsMap
    );
  }

  return [
    ...rowsLocal,
    ...rowsDb.filter((row) => rowsDbMap.has(row._rowy_ref.path)),
  ];
});

/** Store next page state for infinite scroll */
export const tableNextPageAtom = atom({
  loading: false,
  available: true,
} as NextPageState);

/**
 * Store function to add or update row in db directly.
 * Has same behaviour as Firestore setDoc with merge.
 * @see
 * - {@link updateRowData} implementation
 * - https://stackoverflow.com/a/47554197/3572007
 * @internal Use {@link addRowAtom} or {@link updateRowAtom} instead
 */
export const _updateRowDbAtom = atom<UpdateCollectionDocFunction | undefined>(
  undefined
);
/**
 * Store function to delete row in db directly
 * @internal Use {@link deleteRowAtom} instead
 */
export const _deleteRowDbAtom = atom<DeleteCollectionDocFunction | undefined>(
  undefined
);
/**
 * Store function to bulk write to db
 * @internal Use {@link bulkAddRowsAtom} instead
 */
export const _bulkWriteDbAtom = atom<BulkWriteFunction | undefined>(undefined);

export type AuditChangeFunction = (
  type: "ADD_ROW" | "UPDATE_CELL" | "DELETE_ROW",
  rowId: string,
  data?:
    | {
        updatedField?: string | undefined;
      }
    | undefined
) => Promise<any>;
/**
 * Store function to write auditing logs when user makes changes to the table.
 * Silently fails if auditing is disabled for the table or Rowy Run version
 * not compatible.
 *
 * @param type - Action type: "ADD_ROW" | "UPDATE_CELL" | "DELETE_ROW"
 * @param rowId - ID of row updated
 * @param data - Optional additional data to log
 */
export const auditChangeAtom = atom<AuditChangeFunction | undefined>(undefined);

/**
 * Store total number of rows in the table, respecting current filters.
 * If `undefined`, the query hasn’t loaded yet.
 */
export const serverDocCountAtom = atom<number | undefined>(undefined);
