import { useAtom, useSetAtom } from "jotai";
import { Column } from "react-data-grid";

import { Button } from "@mui/material";
import { AddColumn as AddColumnIcon } from "@src/assets/icons";

import { globalScope, userRolesAtom } from "@src/atoms/globalScope";
import { tableScope, columnModalAtom } from "@src/atoms/tableScope";

const FinalColumnHeader: Column<any>["headerRenderer"] = ({ column }) => {
  const [userRoles] = useAtom(userRolesAtom, globalScope);
  const openColumnModal = useSetAtom(columnModalAtom, tableScope);

  if (!userRoles.includes("ADMIN")) return null;

  return (
    <Button
      onClick={(e) => openColumnModal({ type: "new" })}
      variant="contained"
      color="primary"
      startIcon={<AddColumnIcon />}
      style={{ zIndex: 1 }}
    >
      Add column
    </Button>
  );
};

export default FinalColumnHeader;
