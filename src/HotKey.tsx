import React, { useCallback, useEffect } from "react";
import { FieldType } from "@src/constants/fields";
import { useProjectContext } from "@src/contexts/ProjectContext";

export default function Hotkey({ children }: any) {
  const { addRow, columnMenuRef } = useProjectContext();
  const CREATE_COLUMN = "c";
  const CREATE_ROW = "r";
  const CREATE_TABLE = "t";
  const FILTER = "f";
  const SEARCH = "s";

  function handleCreateColumn() {
    if (!columnMenuRef) return;
    columnMenuRef?.current?.setSelectedColumnHeader({
      column: { isNew: true, key: "new", type: FieldType.last } as any,
      anchorEl: undefined,
    });
  }

  function handleCreateRow() {
    ///addRow!(undefined, undefined, { type: "smaller" });
  }

  function handleCreateTable() {
    //if pathname is not '/' aka Home return
    //else handle create table
  }

  const hotKeyTable: any = (key: string) =>
    ({
      [CREATE_COLUMN]: handleCreateColumn,
      [CREATE_ROW]: handleCreateRow,
      [CREATE_TABLE]: handleCreateTable,
      [FILTER]: () => console.log("TODO"),
      [SEARCH]: () => console.log("TODO"),
    }[key]);

  const handleKeyPress = useCallback((e) => {
    console.log(e.ctrKey);
    if (e.ctrKey) {
      console.log("inside", e.key);
      const command: any = hotKeyTable(e.key);
      console.log(command);
      if (typeof command === "function") command();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", (e) => handleKeyPress);
    return () => {
      document.removeEventListener("keydown", (e) => handleKeyPress);
    };
  }, [handleKeyPress]);
  return <>{children}</>;
}
