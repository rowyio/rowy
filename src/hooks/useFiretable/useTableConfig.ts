import { useEffect } from "react";
import useDoc, { DocActions } from "../useDoc";
import { FieldType } from "../../components/Fields";
import _camelCase from "lodash/camelCase";
const useTableConfig = (tablePath: string) => {
  const [tableConfigState, documentDispatch] = useDoc({
    path: `${tablePath}/_FIRETABLE_`,
  });
  useEffect(() => {
    const { doc, columns } = tableConfigState;
    if (doc && columns !== doc.columns) {
      documentDispatch({ columns: doc.columns });
    }
  }, [tableConfigState]);
  const setTable = (table: string) => {
    documentDispatch({ path: `${table}/_FIRETABLE_`, columns: [], doc: null });
  };
  const add = (name: string, type: FieldType) => {
    //TODO: validation
    const { columns } = tableConfigState;
    const key = _camelCase(name);
    documentDispatch({
      action: DocActions.update,
      data: { columns: [...columns, { name, key, type }] },
    });
  };
  const resize = (index: number, width: number) => {
    const { columns } = tableConfigState;
    columns[index].width = width;
    documentDispatch({ action: DocActions.update, data: { columns } });
  };
  const rename = () => {};
  const actions = {
    add,
    resize,
    rename,
    setTable,
  };
  return [tableConfigState, actions];
};

export default useTableConfig;
