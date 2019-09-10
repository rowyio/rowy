import { useEffect } from "react";
import useDoc, { DocActions } from "./useDoc";
export enum FieldType {
  simpleText = "SIMPLE_TEXT",
  longText = "LONG_TEXT",
  email = "EMAIL",
  PhoneNumber = "PHONE_NUMBER",
  checkBox = "CHECK_BOX"
}
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
    console.log(columnName, fieldName, type);
  };
  const actions = {
    addColumn,
    setTable
  };
  return [tableConfigState, actions];
};

export default useTableConfig;
