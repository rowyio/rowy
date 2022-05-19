import { useAtom } from "jotai";
import { Column } from "react-data-grid";

import { Button } from "@mui/material";
import AddColumnIcon from "@src/assets/icons/AddColumn";

import { globalScope, userRolesAtom } from "@src/atoms/globalScope";

const FinalColumnHeader: Column<any>["headerRenderer"] = ({ column }) => {
  const [userRoles] = useAtom(userRolesAtom, globalScope);
  // FIXME: const { columnMenuRef } = useProjectContext();
  // if (!columnMenuRef) return null;

  if (!userRoles.includes("ADMIN")) return null;

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // columnMenuRef?.current?.setSelectedColumnHeader({
    //   column,
    //   anchorEl: event.currentTarget,
    // });
  };

  return (
    <Button
      onClick={handleClick}
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
