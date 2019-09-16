import { useEffect } from "react";
import useDoc, { DocActions } from "../useDoc";
import { FieldType } from "../../components/Fields";
const useTableConfig = (tablePath: string) => {
  const [tableConfigState, documentDispatch] = useDoc({
    path: `${tablePath}/_FIRETABLE_`
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
  const addColumn = (
    columnName: string,
    fieldName: string,
    type: FieldType
  ) => {
    const { columns } = tableConfigState;
    documentDispatch({
      action: DocActions.update,
      data: { columns: [...columns, { columnName, fieldName, type }] }
    });
  };
  const actions = {
    addColumn,
    setTable
  };
  return [tableConfigState, actions];
};

export default useTableConfig;
