import { useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import _camelCase from "lodash/camelCase";

import _orderBy from "lodash/orderBy";
import _sortBy from "lodash/sortBy";

import useDoc, { DocActions } from "../useDoc";
import { FieldType } from "@src/constants/fields";
import { formatPath } from "../../utils/fns";
import { db, deleteField } from "../../firebase";

export type ColumnConfig = {
  fieldName: string;
  key: string;
  name: string;
  type: FieldType;
  index: number;
  width?: number;
  editable?: boolean;
  config: { [key: string]: any };
  [key: string]: any;
};

const useTableConfig = (tableId?: string) => {
  const [tableConfigState, documentDispatch] = useDoc({
    path: tableId ? formatPath(tableId) : "",
  });

  useEffect(() => {
    const { doc, columns, rowHeight, functionConfigPath } = tableConfigState;
    // TODO: REMOVE THIS
    // Copy columns, rowHeight to tableConfigState
    if (doc && columns !== doc.columns) {
      documentDispatch({ columns: doc.columns });
    }
    if (doc && rowHeight !== doc.rowHeight) {
      documentDispatch({ rowHeight: doc.rowHeight });
    }
    if (doc && functionConfigPath !== doc.functionConfigPath) {
      documentDispatch({ functionConfigPath: doc.functionConfigPath });
    }
  }, [tableConfigState.doc]);
  /**  used for specifying the table in use
   *  @param table firestore collection path
   */
  const setTable = (id: string) => {
    documentDispatch({
      id,
      path: formatPath(id),
      columns: [],
      doc: null,
      ref: db.doc(formatPath(id)),
      loading: true,
    });
  };
  /**  used for creating a new column
   *  @param name of column.
   *  @param type of column
   *  @param data additional column properties
   */
  const addColumn = (name: string, type: FieldType, data?: any) => {
    //TODO: validation
    const { columns } = tableConfigState;
    const newIndex = Object.keys(columns).length ?? 0;
    let updatedColumns = { ...columns };
    const key = _camelCase(name);
    updatedColumns[key] = { name, key, type, ...data, index: newIndex ?? 0 };
    documentDispatch({
      action: DocActions.update,
      data: { columns: updatedColumns },
    });
  };

  /**  used for updating the width of column
   *  @param index of column.
   *  @param width number of pixels, eg: 120
   */
  const [resize] = useDebouncedCallback((index: number, width: number) => {
    const { columns } = tableConfigState;
    const _columnValues = Object.values(columns);
    const numberOfFixedColumns = _columnValues.filter(
      (col: any) => col.fixed && !col.hidden
    ).length;
    const columnsArray = _sortBy(
      _columnValues.filter((col: any) => !col.hidden && !col.fixed),
      "index"
    );

    const targetColumn: any = columnsArray[index - numberOfFixedColumns];
    const updatedColumns = {
      ...columns,
      [targetColumn.key]: { ...targetColumn, width },
    };

    documentDispatch({
      action: DocActions.update,
      data: { columns: updatedColumns },
    });
  }, 1000);
  // type updatable = { field: string; value: unknown };

  /**  used for updating column properties such as type,name etc.
   *  @param index of column.
   *  @param {updatable[]} updatables properties to be updated
   */
  const updateColumn = (key: string, updates: any, onSuccess?: Function) => {
    const { columns } = tableConfigState;

    const updatedColumns = {
      ...columns,
      [key]: { ...columns[key], ...updates },
    };

    documentDispatch({
      action: DocActions.update,
      data: { columns: updatedColumns },
      callback: onSuccess,
    });
  };

  /** insert column by index
   * @param col     properties of new column
   * @param source  source object { index: selected source index, insert: left | right }
   */
  const insert = (col, source) => {
    const { columns } = tableConfigState;
    const orderedCol = _orderBy(Object.values(columns), "index");

    //offset index is necessary for splice insert
    const offset = source.insert === "left" ? 0 : 1;

    //insert poistion, is source index + offset
    //if source.index is undefined, set target index to end of row
    const targetIndx = Boolean(typeof source.index === "undefined")
      ? orderedCol.length
      : source.index + offset;

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
    orderedCol.splice(targetIndx, 0, col);

    const updatedColumns = orderedCol.reduce(
      (acc: any, col: any, indx: number) => {
        acc[col.key] = { ...col, index: indx };
        return acc;
      },
      {}
    );

    documentDispatch({
      action: DocActions.update,
      data: { columns: updatedColumns },
    });
  };
  /** remove column by index
   *  @param key of column.
   */
  const remove = (key: string) => {
    const { columns } = tableConfigState;
    /**
     *  Filter column, and remove key index
     *  Sort and reorder column
     *  Rewrite column index for firestore
     */
    const updatedColumns: any = Object.values(columns)
      .filter((c: any) => c.key !== key)
      .sort((a: any, b: any) => a.index - b.index)
      .reduce((acc: any, curr: any, index: any) => {
        acc[curr.key] = { ...curr, index };
        return acc;
      }, {});

    const deleteColumn = { [key]: deleteField() };
    const finalColumns = { ...updatedColumns, ...deleteColumn };

    documentDispatch({
      action: DocActions.update,
      data: { columns: finalColumns },
    });
  };
  /** reorder columns by key
   * @param draggedColumnKey column being repositioned.
   * @param droppedColumnKey column being .
   */
  const reorder = (draggedColumnKey: string, droppedColumnKey: string) => {
    const { columns } = tableConfigState;
    const oldIndex = columns[draggedColumnKey].index;
    const newIndex = columns[droppedColumnKey].index;

    //sort columns by index, remove drag col, insert it in drop position
    const sortedColumns = _sortBy(Object.values(columns), "index");
    const removeCol = sortedColumns.splice(oldIndex, 1);
    sortedColumns.splice(newIndex, 0, removeCol[0]);

    //itereate and update index to proper value
    const updatedColumns = sortedColumns.reduce(
      (acc: any, curr: any, index) => {
        acc[curr.key] = { ...curr, index };
        return acc;
      },
      {}
    );

    documentDispatch({
      action: DocActions.update,
      data: { columns: updatedColumns },
    });
  };
  /** changing table configuration used for things such as row height
   * @param key name of parameter eg. rowHeight
   * @param value new value eg. 65
   */
  const updateConfig = (key: string, value: any, callback?: Function) => {
    documentDispatch({
      action: DocActions.update,
      data: { [key]: value },
      callback,
    });
  };
  const actions = {
    insert,
    updateColumn,
    updateConfig,
    addColumn,
    resize,
    setTable,
    remove,
    reorder,
  };
  return [tableConfigState, actions];
};

export default useTableConfig;
