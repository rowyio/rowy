import { useAtom } from "jotai";
import { RESET } from "jotai/utils";

import NewColumnModal from "./NewColumnModal";
import NameChangeModal from "./NameChangeModal";
import TypeChangeModal from "./TypeChangeModal";
import ColumnConfigModal from "./ColumnConfigModal";

import {
  tableScope,
  tableSchemaAtom,
  columnModalAtom,
} from "@src/atoms/tableScope";
import { ColumnConfig } from "@src/types/table";

export interface IColumnModalProps {
  handleClose: () => void;
  column: ColumnConfig;
}

export default function ColumnModals() {
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [columnModal, setColumnModal] = useAtom(columnModalAtom, tableScope);

  if (!columnModal) return null;

  const handleClose = () => setColumnModal(RESET);

  if (columnModal.type === "new")
    return <NewColumnModal handleClose={handleClose} />;

  const column = tableSchema.columns?.[columnModal.columnKey ?? ""];
  if (!column) return null;

  if (columnModal.type === "name")
    return <NameChangeModal handleClose={handleClose} column={column} />;

  if (columnModal.type === "type")
    return <TypeChangeModal handleClose={handleClose} column={column} />;

  if (columnModal.type === "config")
    return <ColumnConfigModal handleClose={handleClose} column={column} />;

  return null;
}
