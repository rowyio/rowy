import { renderHook, act } from "@testing-library/react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  tableScope,
  tableSchemaAtom,
  updateTableSchemaAtom,
  addColumnAtom,
  updateColumnAtom,
  deleteColumnAtom,
} from "@src/atoms/tableScope";
import { TableSchema } from "@src/types/table";

import { FieldType } from "@src/constants/fields";

const initUpdateTableSchemaAtom = (initialTableSchema?: TableSchema) =>
  renderHook(() => {
    const setTableSchema = useSetAtom(tableSchemaAtom, tableScope);
    setTableSchema(initialTableSchema ?? {});

    const setUpdateTableSchema = useSetAtom(updateTableSchemaAtom, tableScope);
    setUpdateTableSchema(() => async (update: Partial<TableSchema>) => {
      setTableSchema(update);
    });
  });

const GENERATED_COLUMNS_LENGTH = 10;
const generatedColumns: TableSchema["columns"] = {};
for (let i = 0; i < GENERATED_COLUMNS_LENGTH; i++)
  generatedColumns[`column${i}`] = {
    key: `column${i}`,
    fieldName: `column${i}`,
    name: `Column ${i}`,
    type: FieldType.shortText,
    index: i,
    config: {},
  };

describe("addColumn", () => {
  const columnToAdd = {
    key: "firstName",
    fieldName: "firstName",
    name: "First Name",
    type: FieldType.shortText,
    index: 0,
    config: {},
  };

  test("adds a column to an empty schema", async () => {
    initUpdateTableSchemaAtom();
    const {
      result: { current: addColumn },
    } = renderHook(() => useAtomValue(addColumnAtom, tableScope));
    expect(addColumn).toBeDefined();

    await act(() => addColumn(columnToAdd));

    const {
      result: { current: tableSchema },
    } = renderHook(() => useAtomValue(tableSchemaAtom, tableScope));
    expect(tableSchema?.columns).toHaveProperty("firstName");
    expect(tableSchema?.columns?.firstName).toStrictEqual(columnToAdd);
  });

  test("adds a column to the end", async () => {
    initUpdateTableSchemaAtom({ columns: generatedColumns });
    const {
      result: { current: addColumn },
    } = renderHook(() => useAtomValue(addColumnAtom, tableScope));
    expect(addColumn).toBeDefined();

    await act(() => addColumn(columnToAdd));

    const {
      result: { current: tableSchema },
    } = renderHook(() => useAtomValue(tableSchemaAtom, tableScope));
    expect(tableSchema?.columns).toHaveProperty("firstName");
    expect(tableSchema?.columns?.firstName.index).toEqual(
      GENERATED_COLUMNS_LENGTH
    );
  });

  test("adds a column at specified index", async () => {
    initUpdateTableSchemaAtom({ columns: generatedColumns });
    const {
      result: { current: addColumn },
    } = renderHook(() => useAtomValue(addColumnAtom, tableScope));
    expect(addColumn).toBeDefined();

    await act(() => addColumn(columnToAdd, 7));

    const {
      result: { current: tableSchema },
    } = renderHook(() => useAtomValue(tableSchemaAtom, tableScope));
    expect(tableSchema?.columns).toHaveProperty("firstName");
    expect(tableSchema?.columns?.firstName.index).toEqual(7);
    expect(tableSchema?.columns?.["column7"].index).toEqual(8);
    expect(tableSchema?.columns?.["column8"].index).toEqual(9);
    expect(tableSchema?.columns?.["column9"].index).toEqual(10);
  });
});

describe("updateColumn", () => {
  test("updates a column without reordering", async () => {
    initUpdateTableSchemaAtom({ columns: generatedColumns });
    const {
      result: { current: updateColumn },
    } = renderHook(() => useAtomValue(updateColumnAtom, tableScope));
    expect(updateColumn).toBeDefined();

    await act(() => updateColumn("column7", { name: "Updated column" }));

    const {
      result: { current: tableSchema },
    } = renderHook(() => useAtomValue(tableSchemaAtom, tableScope));
    expect(Object.keys(tableSchema?.columns ?? {})).toHaveLength(
      GENERATED_COLUMNS_LENGTH
    );
    expect(tableSchema?.columns?.column7.name).toEqual("Updated column");

    for (let i = 0; i < GENERATED_COLUMNS_LENGTH; i++) {
      expect(tableSchema?.columns?.[`column${i}`].index).toEqual(i);
    }
  });

  test("updates a column and reorders forwards", async () => {
    initUpdateTableSchemaAtom({ columns: generatedColumns });
    const {
      result: { current: updateColumn },
    } = renderHook(() => useAtomValue(updateColumnAtom, tableScope));
    expect(updateColumn).toBeDefined();

    const SOURCE_INDEX = 2;
    const TARGET_INDEX = 4;
    await act(() =>
      updateColumn(
        `column${SOURCE_INDEX}`,
        { name: "Updated column" },
        TARGET_INDEX
      )
    );

    const {
      result: { current: tableSchema },
    } = renderHook(() => useAtomValue(tableSchemaAtom, tableScope));
    expect(Object.keys(tableSchema?.columns ?? {})).toHaveLength(
      GENERATED_COLUMNS_LENGTH
    );
    expect(tableSchema?.columns?.[`column${SOURCE_INDEX}`].name).toEqual(
      "Updated column"
    );

    for (let i = 0; i < GENERATED_COLUMNS_LENGTH; i++) {
      let expectedIndex = i;
      if (i === SOURCE_INDEX) expectedIndex = TARGET_INDEX;
      else if (i > SOURCE_INDEX && i <= TARGET_INDEX) expectedIndex = i - 1;

      expect(tableSchema?.columns?.[`column${i}`].index).toEqual(expectedIndex);
    }
  });

  test("updates a column and reorders backwards", async () => {
    initUpdateTableSchemaAtom({ columns: generatedColumns });
    const {
      result: { current: updateColumn },
    } = renderHook(() => useAtomValue(updateColumnAtom, tableScope));
    expect(updateColumn).toBeDefined();

    const SOURCE_INDEX = 9;
    const TARGET_INDEX = 3;
    await act(() =>
      updateColumn(
        `column${SOURCE_INDEX}`,
        { name: "Updated column" },
        TARGET_INDEX
      )
    );

    const {
      result: { current: tableSchema },
    } = renderHook(() => useAtomValue(tableSchemaAtom, tableScope));
    expect(Object.keys(tableSchema?.columns ?? {})).toHaveLength(
      GENERATED_COLUMNS_LENGTH
    );
    expect(tableSchema?.columns?.[`column${SOURCE_INDEX}`].name).toEqual(
      "Updated column"
    );

    for (let i = 0; i < GENERATED_COLUMNS_LENGTH; i++) {
      let expectedIndex = i;
      if (i === SOURCE_INDEX) expectedIndex = TARGET_INDEX;
      else if (i < SOURCE_INDEX && i >= TARGET_INDEX) expectedIndex = i + 1;

      expect(tableSchema?.columns?.[`column${i}`].index).toEqual(expectedIndex);
    }
  });

  test("doesn't update a column that doesn't exist", async () => {
    initUpdateTableSchemaAtom({ columns: generatedColumns });
    const {
      result: { current: updateColumn },
    } = renderHook(() => useAtomValue(updateColumnAtom, tableScope));
    expect(updateColumn).toBeDefined();

    expect(() => {
      act(() => updateColumn("nonExistentColumn", {}));
    }).toThrow(/Column with key .* not found/);

    const {
      result: { current: tableSchema },
    } = renderHook(() => useAtomValue(tableSchemaAtom, tableScope));
    expect(tableSchema?.columns).toStrictEqual(generatedColumns);
  });

  test("doesn't update empty columns", async () => {
    initUpdateTableSchemaAtom();
    const {
      result: { current: updateColumn },
    } = renderHook(() => useAtomValue(updateColumnAtom, tableScope));
    expect(updateColumn).toBeDefined();

    expect(() => {
      act(() => updateColumn("nonExistentColumn", {}));
    }).toThrow(/Column with key .* not found/);

    const {
      result: { current: tableSchema },
    } = renderHook(() => useAtomValue(tableSchemaAtom, tableScope));
    expect(Object.keys(tableSchema?.columns ?? {})).toHaveLength(0);
  });
});

describe("deleteColumn", () => {
  test("deletes a column", async () => {
    initUpdateTableSchemaAtom({ columns: generatedColumns });
    const {
      result: { current: deleteColumn },
    } = renderHook(() => useAtomValue(deleteColumnAtom, tableScope));
    expect(deleteColumn).toBeDefined();

    await act(() => deleteColumn("column7"));

    const {
      result: { current: tableSchema },
    } = renderHook(() => useAtomValue(tableSchemaAtom, tableScope));
    expect(tableSchema?.columns).not.toHaveProperty("column7");
    expect(tableSchema?.columns?.["column8"].index).toEqual(7);
    expect(tableSchema?.columns?.["column9"].index).toEqual(8);
  });

  test("doesn't delete a non-existent column", async () => {
    initUpdateTableSchemaAtom({ columns: generatedColumns });
    const {
      result: { current: deleteColumn },
    } = renderHook(() => useAtomValue(deleteColumnAtom, tableScope));
    expect(deleteColumn).toBeDefined();

    await act(() => deleteColumn("column72"));

    const {
      result: { current: tableSchema },
    } = renderHook(() => useAtomValue(tableSchemaAtom, tableScope));
    expect(tableSchema?.columns).toHaveProperty("column7");
    expect(Object.keys(tableSchema?.columns ?? {})).toHaveLength(
      GENERATED_COLUMNS_LENGTH
    );
  });

  test("doesn't delete from empty columns", async () => {
    initUpdateTableSchemaAtom();
    const {
      result: { current: deleteColumn },
    } = renderHook(() => useAtomValue(deleteColumnAtom, tableScope));
    expect(deleteColumn).toBeDefined();

    await act(() => deleteColumn("column7"));

    const {
      result: { current: tableSchema },
    } = renderHook(() => useAtomValue(tableSchemaAtom, tableScope));
    expect(Object.keys(tableSchema?.columns ?? {})).toHaveLength(0);
  });
});
