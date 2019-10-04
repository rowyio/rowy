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

  const setTable = (table: string) => {
    documentDispatch({
      path: `${table}/_FIRETABLE_`,
      columns: [],
      doc: null,
      loading: true,
    });
  };
  const add = (name: string, type: FieldType, data?: unknown) => {
    //TODO: validation
    const { columns } = tableConfigState;
    const key = _camelCase(name);
    documentDispatch({
      action: DocActions.update,
      data: { columns: [...columns, { name, key, type, ...data }] },
    });
  };
  const resize = (index: number, width: number) => {
    const { columns } = tableConfigState;
    columns[index].width = width;
    documentDispatch({ action: DocActions.update, data: { columns } });
  };
  type updatable = { field: string; value: unknown };
  const updateColumn = (index: number, updatables: updatable[]) => {
    const { columns } = tableConfigState;
    updatables.forEach((updatable: updatable) => {
      columns[index][updatable.field] = updatable.value;
    });
    documentDispatch({ action: DocActions.update, data: { columns } });
  };

  const remove = (index: number) => {
    const { columns } = tableConfigState;
    columns.splice(index, 1);
    documentDispatch({ action: DocActions.update, data: { columns } });
  };
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
