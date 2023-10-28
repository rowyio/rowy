import { sideDrawerAtom, tableScope } from "@src/atoms/tableScope";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import { useRegisterActions } from "kbar";

const TableInformationActionRegister = () => {
  const [sideDrawer, setSideDrawer] = useAtom(sideDrawerAtom, tableScope);
  useRegisterActions([
    {
      id: "tableInformation",
      name: "Table information",
      shortcut: ["x", "i"],
      keywords: "See table information",
      perform: () => {
        setSideDrawer(sideDrawer ? RESET : "table-information");
      },
    },
  ]);
  return null;
};

export default TableInformationActionRegister