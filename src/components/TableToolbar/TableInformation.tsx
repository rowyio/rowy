import { useAtom } from "jotai";
import { RESET } from "jotai/utils";

import TableToolbarButton from "@src/components/TableToolbar/TableToolbarButton";
import InfoIcon from "@mui/icons-material/InfoOutlined";

import {
  sideDrawerAtom,
  tableScope,
  tableSettingsAtom,
} from "@src/atoms/tableScope";
import TableInformationActionRegister from "./KbarActions/TableInformationActionRegister";

export default function TableInformation() {
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [sideDrawer, setSideDrawer] = useAtom(sideDrawerAtom, tableScope);

  return (
    <>
      {!(!setSideDrawer || tableSettings.id.includes("/")) ? (
        <TableInformationActionRegister />
      ) : (
        ""
      )}
      <TableToolbarButton
        title="Table information"
        icon={<InfoIcon />}
        onClick={() => setSideDrawer(sideDrawer ? RESET : "table-information")}
        disabled={!setSideDrawer || tableSettings.id.includes("/")}
      />
    </>
  );
}
