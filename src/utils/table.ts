import { mergeWith, isArray, get, isNumber } from "lodash-es";
import { Cell, Table } from "@tanstack/react-table";
import type { User } from "firebase/auth";
import { TABLE_GROUP_SCHEMAS, TABLE_SCHEMAS } from "@src/config/dbPaths";
import { TableSettings } from "@src/types/table";
import { SelectedCopyCells } from "@src/atoms/tableScope";
import { TableRow } from "@src/types/table";

/**
 * Creates a standard user object to write to table rows
 * @param currentUser - The current signed-in user
 * @param data - Any additional data to include
 * @returns rowyUser object
 */
export const rowyUser = (currentUser: User, data?: Record<string, any>) => {
  const { displayName, email, uid, emailVerified, isAnonymous, photoURL } =
    currentUser;

  return {
    timestamp: new Date(),
    displayName,
    email,
    uid,
    emailVerified,
    isAnonymous,
    photoURL,
    ...data,
  };
};

/**
 * Updates row data with the same behavior as Firestore’s setDoc with merge.
 * Merges objects recursively, but overwrites arrays.
 * @see https://stackoverflow.com/a/47554197/3572007
 * @param row - The source row to update
 * @param update - The partial update to apply
 * @returns The row with updated values
 */
export const updateRowData = <T = Record<string, any>>(
  row: T,
  update: Partial<T>
): T =>
  mergeWith(
    row,
    update,
    // If the proeprty to be merged is array, overwrite the array entirely
    (objValue, srcValue) => (isArray(objValue) ? srcValue : undefined)
  );

/** Omits internal `_rowy_*` fields for writing to the database */
export const omitRowyFields = <T = Record<string, any>>(row: T) => {
  const shallowClonedRow: any = { ...row };
  delete shallowClonedRow["_rowy_ref"];
  delete shallowClonedRow["_rowy_outOfOrder"];
  delete shallowClonedRow["_rowy_missingRequiredFields"];
  delete shallowClonedRow["_rowy_new"];

  Object.keys(shallowClonedRow).forEach((key) => {
    if (key.startsWith("_rowy_formulaValue_")) {
      delete shallowClonedRow[key];
    }
  });

  return shallowClonedRow as T;
};

const ID_CHARACTERS =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/**
 * Generate an ID compatible with Firestore
 * @param length - The length of the ID to generate
 * @returns - Generated ID
 */
export const generateId = (length: number = 20) => {
  let result = "";
  const charactersLength = ID_CHARACTERS.length;
  for (var i = 0; i < length; i++)
    result += ID_CHARACTERS.charAt(
      Math.floor(Math.random() * charactersLength)
    );

  return result;
};

/**
 * Lexicographically decrement a given ID
 * @param id - The ID to decrement. If not provided, set to 20 `z` characters
 * @returns - The decremented ID
 */
export const decrementId = (id: string = "zzzzzzzzzzzzzzzzzzzz") => {
  const newId = id.split("");

  // Loop through ID characters from the end
  let i = newId.length - 1;
  while (i > -1) {
    const newCharacterIndex = ID_CHARACTERS.indexOf(newId[i]) - 1;

    newId[i] =
      ID_CHARACTERS[
        newCharacterIndex > -1 ? newCharacterIndex : ID_CHARACTERS.length - 1
      ];

    // If we don’t hit 0, we’re done
    if (newCharacterIndex > -1) break;

    // Otherwise, if we hit 0, we need to decrement the next character
    i--;
  }

  // Ensure we don't get 00...0, then the next ID would be 00...0z,
  // which would appear as the second row
  if (newId.every((x) => x === ID_CHARACTERS[0]))
    newId.push(ID_CHARACTERS[ID_CHARACTERS.length - 1]);

  return newId.join("");
};

// Gets sub-table ID in $1
const formatPathRegex = /\/[^\/]+\/([^\/]+)/g;

/**
 * Gets the path to the table’s schema doc, accounting for sub-tables
 * and collectionGroup tables
 * @param id - The table ID (could include sub-table ID)
 * @param tableType - primaryCollection (default) or collectionGroup
 * @returns Path to the table’s schema doc
 */
export const getTableSchemaPath = (
  tableSettings: Pick<TableSettings, "id" | "tableType">
) =>
  (tableSettings.tableType === "collectionGroup"
    ? TABLE_GROUP_SCHEMAS
    : TABLE_SCHEMAS) +
  "/" +
  tableSettings.id.replace(formatPathRegex, "/subTables/$1");

/**
 * Format sub-table name to store settings in user settings
 * @param id - Sub-table ID, including parent table ID
 * @returns Standardized sub-table name
 */
export const formatSubTableName = (id?: string) =>
  id ? id.replace(formatPathRegex, "/subTables/$1").replace(/\//g, "_") : "";

/**
 * Gets the pathname of the table or sub-table
 * for Rowy Run `buildFunction` endpoint.
 * Rowy Run expects the previous URL format for sub-tables.
 * @param id - Table ID (or sub-table ID from tableIdAtom)
 * @param tableType - primaryCollection (default) or collectionGroup
 * @returns - pathname
 */
export const getTableBuildFunctionPathname = (
  id: string,
  tableType: "primaryCollection" | "collectionGroup" = "primaryCollection"
) => {
  const root =
    "/" + (tableType === "collectionGroup" ? "tableGroup" : "table") + "/";

  if (!id.includes("/")) return root + id;

  const split = id.split("/");
  const rootTableId = split.shift();
  return root + rootTableId + encodeURIComponent("/" + split.join("/"));
};

export enum CopyDirection {
  Vertical,
  Horizontal,
}

export function getCopyDirection(
  selectedCells: SelectedCopyCells,
  endY: number,
  endX: number
): CopyDirection {
  const di = Math.min(
    Math.abs(endY - selectedCells.down),
    Math.abs(endY - selectedCells.up)
  );
  const dj = Math.min(
    Math.abs(endX - selectedCells.right),
    Math.abs(endX - selectedCells.left)
  );
  return di >= dj ? CopyDirection.Vertical : CopyDirection.Horizontal;
}

export function updateCellValues(
  cells: Cell<TableRow, unknown>[],
  updateData: TableRow[],
  newUpdate: Partial<TableRow>,
  rowIndex: number,
  cellIndex: number,
  selectedRowIndex: number,
  copyCellIndex: number,
  useCopyCellIndex?: boolean
) {
  let cell = cells[cellIndex];
  let copyCell = cells[copyCellIndex];
  let selectedRow = updateData[selectedRowIndex];
  let row = updateData[rowIndex];
  if (cell && row && selectedRow) {
    let key = cell.column.id;
    let copyKey = copyCell?.column?.id;
    newUpdate[key] = get(selectedRow, useCopyCellIndex ? copyKey : key, "");
  }
}

export function updateStartIndex(
  startIndex: number,
  endY: number,
  endX: number,
  left: number,
  right: number,
  down: number,
  up: number,
  isHorizontal?: boolean
) {
  if (isHorizontal) {
    if (endX < right) {
      startIndex = startIndex === left ? right + 1 : startIndex;
      startIndex--;
    } else {
      startIndex = startIndex === right ? left - 1 : startIndex;
      startIndex++;
    }
    return startIndex;
  }

  if (endY > down) {
    startIndex = startIndex === down ? up - 1 : startIndex;
    startIndex++;
  } else {
    startIndex = startIndex === up ? down + 1 : startIndex;
    startIndex--;
  }
  return startIndex;
}

export function getNewUpdateDetails(
  updateData: TableRow[],
  rowIndex: number,
  newUpdate: Partial<TableRow>
) {
  return {
    row: updateData[rowIndex],
    path: updateData[rowIndex]._rowy_ref.path,
    newUpdate,
    deleteField: false,
    arrayTableData: updateData[rowIndex]._rowy_ref.arrayTableData,
  };
}

export function getCellStyle(
  selectedCopyCells: SelectedCopyCells | null,
  row_index: number,
  cell_index: number,
  endCellId: string | null
): React.CSSProperties {
  if (!selectedCopyCells) {
    return {};
  }
  const { up, down, left, right, rowIndex, cellIndex } = selectedCopyCells;
  if (rowIndex === row_index && cell_index === cellIndex) {
    return {
      backgroundColor:
        down - up !== 0 || right - left !== 0 || endCellId
          ? "#3498db"
          : "transparent",
    };
  }
  if (
    row_index <= down &&
    row_index >= up &&
    cell_index >= left &&
    cell_index <= right
  ) {
    return {
      backgroundColor: "#3498db",
    };
  }

  return {};
}

export function getCopySelectedCellStyle(
  selectedCopyCells: SelectedCopyCells | null,
  endCellId: string | null,
  tableInstance: Table<TableRow> | undefined,
  row_index: number,
  cell_index: number
) {
  if (!endCellId || !selectedCopyCells) {
    return {};
  }
  const { up, down, left, right, rowIndex, cellIndex } = selectedCopyCells;
  const rows = tableInstance?.getRowModel().rows;
  if (rowIndex === row_index && cell_index === cellIndex) {
    return {};
  }
  if (
    row_index <= down &&
    row_index >= up &&
    cell_index >= left &&
    cell_index <= right
  ) {
    return {};
  }
  if (endCellId && rows) {
    const cellMeta = endCellId.split("__");
    const cellId = cellMeta[1];
    const endY = parseInt(cellMeta[0] ?? "");
    if (isNumber(endY)) {
      const row = rows[endY];
      const endX = row
        ?._getAllVisibleCells()
        .findIndex((cell: Cell<TableRow, any>) => cell.id === cellId);
      if (isNumber(endX)) {
        const direction = getCopyDirection(selectedCopyCells, endY, endX);
        if (
          endY < down &&
          endY > up &&
          row_index <= down &&
          row_index >= up &&
          ((cell_index < left && cell_index >= endX) ||
            (cell_index > right && cell_index <= endX))
        ) {
          return {
            backgroundColor: "#FFDDDD",
          };
        }
        if (direction === CopyDirection.Vertical) {
          if (
            (row_index <= up - 1 &&
              row_index >= endY &&
              cell_index <= right &&
              cell_index >= left) ||
            (row_index >= down + 1 &&
              row_index <= endY &&
              cell_index >= left &&
              cell_index <= right)
          ) {
            return {
              backgroundColor: "#FFDDDD",
            };
          }
        } else {
          if (
            row_index <= down &&
            row_index >= up &&
            ((cell_index >= right + 1 && cell_index <= endX) ||
              (cell_index >= endX && cell_index < left))
          ) {
            return {
              backgroundColor: "#FFDDDD",
            };
          }
        }
      }
    }
  }
  return {};
}

export function getDragDropShowStyles(
  selectedCopyCells: SelectedCopyCells | null,
  row_index: number,
  cell_index: number
) {
  if (!selectedCopyCells) {
    return "none";
  }
  const { down, right } = selectedCopyCells;
  if (down === row_index && cell_index === right) {
    return "block";
  }
  return "none";
}
