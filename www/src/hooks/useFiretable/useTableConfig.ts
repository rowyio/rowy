import { useEffect } from "react";
import useDoc, { DocActions } from "../useDoc";
import { FieldType } from "../../components/Fields";
import _camelCase from "lodash/camelCase";
import _findIndex from "lodash/findIndex";
import { arrayMover } from "../../util/fns";

const useTableConfig = (tablePath: string) => {
  const [tableConfigState, documentDispatch] = useDoc({
    path: `${tablePath}/_FIRETABLE_`,
  });
  useEffect(() => {
    const { doc, columns } = tableConfigState;
    if (doc && columns !== doc.columns) {
      documentDispatch({ columns: doc.columns, rowHeight: doc.rowHeight });
    }
  }, [tableConfigState.doc]);
  /**  used for specifying the table in use
   *  @param table firestore collection path
   */
  const setTable = (table: string) => {
    documentDispatch({
      path: `${table}/_FIRETABLE_`,
      columns: [],
      doc: null,
      loading: true,
    });
  };
  /**  used for creating a new column
   *  @param name of column.
   *  @param type of column
   *  @param data additional column properties
   */
  const add = (name: string, type: FieldType, data?: any) => {
    //TODO: validation

    //console.log("tableConfigState", tableConfigState);
    const { columns } = tableConfigState;
    const key = _camelCase(name);
    documentDispatch({
      action: DocActions.update,
      data: { columns: [...columns, { name, key, type, ...data }] },
    });
  };

  /**  used for updating the width of column
   *  @param index of column.
   *  @param width number of pixels, eg: 120
   */
  const resize = (index: number, width: number) => {
    const { columns } = tableConfigState;
    columns[index].width = width;
    documentDispatch({ action: DocActions.update, data: { columns } });
  };
  type updatable = { field: string; value: unknown };

  /**  used for updating column properties such as type,name etc.
   *  @param index of column.
   *  @param {updatable[]} updatables properties to be updated
   */
  const updateColumn = (index: number, updatables: updatable[]) => {
    const { columns } = tableConfigState;
    updatables.forEach((updatable: updatable) => {
      columns[index][updatable.field] = updatable.value;
    });
    documentDispatch({ action: DocActions.update, data: { columns } });
  };
  /** remove column by index
   *  @param index of column.
   */
  const remove = (index: number) => {
    const { columns } = tableConfigState;
    columns.splice(index, 1);
    documentDispatch({ action: DocActions.update, data: { columns } });
  };
  /** reorder columns by key
   * @param draggedColumnKey column being repositioned.
   * @param droppedColumnKey column being .
   */
  const reorder = (draggedColumnKey: string, droppedColumnKey: string) => {
    const { columns } = tableConfigState;
    const draggedColumnIndex = _findIndex(columns, ["key", draggedColumnKey]);
    const droppedColumnIndex = _findIndex(columns, ["key", droppedColumnKey]);
    const reorderedColumns = [...columns];
    arrayMover(reorderedColumns, draggedColumnIndex, droppedColumnIndex);
    documentDispatch({
      action: DocActions.update,
      data: { columns: reorderedColumns },
    });
  };
  /** changing table configuration used for things such as row height
   * @param key name of parameter eg. rowHeight
   * @param value new value eg. 65
   */
  const updateConfig = (key: string, value: unknown) => {
    documentDispatch({
      action: DocActions.update,
      data: { [key]: value },
    });
  };
  const actions = {
    updateColumn,
    updateConfig,
    add,
    resize,
    setTable,
    remove,
    reorder,
  };
  return [tableConfigState, actions];
};

export default useTableConfig;
