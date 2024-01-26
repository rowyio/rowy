import { columnModalAtom, tableScope } from "@src/atoms/tableScope";
import { useSetAtom } from "jotai";
import { useRegisterActions } from "kbar";

const AddColumnRegister = () => {
  const openColumnModal = useSetAtom(columnModalAtom, tableScope);
  useRegisterActions([
    {
      id: "addColumn",
      name: "Add Column",
      shortcut: ["x", "c"],
      keywords: "Add column",
      perform: () => {
        openColumnModal({ type: "new" });
      },
    },
  ]);
  return null;
};

export default AddColumnRegister;
