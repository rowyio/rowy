import { useEffect, useRef, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { isEqual } from "lodash-es";
import { colord } from "colord";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Box, AutocompleteProps } from "@mui/material";
import IconSlash from "@src/components/IconSlash";

import ColumnSelect, { ColumnItem } from "@src/components/Table/ColumnSelect";
import ButtonWithStatus from "@src/components/ButtonWithStatus";

import {
  globalScope,
  userSettingsAtom,
  updateUserSettingsAtom,
} from "@src/atoms/globalScope";
import {
  tableScope,
  tableSortsAtom,
  tableColumnsOrderedAtom,
  tableIdAtom,
} from "@src/atoms/tableScope";
export default function Sorts() {
  const [tableSorts, setTableSorts] = useAtom(tableSortsAtom, tableScope);
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [userSettings] = useAtom(userSettingsAtom, globalScope);
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const tableColumns: { [key: string]: string } = tableColumnsOrdered.reduce(
    (acc, col) => ({ ...acc, [col.key]: col.name }),
    {}
  );
  if (tableSorts.length === 0) return null;
  const sorted = tableSorts[0];
  return (
    <>
      <ButtonWithStatus
        startIcon={
          sorted.direction === "asc" ? (
            <ArrowUpwardIcon />
          ) : (
            <ArrowDownwardIcon />
          )
        }
        onClick={() => {}}
        active={tableSorts.length > 0}
        ref={buttonRef}
      >
        {tableColumns[sorted.key]}
      </ButtonWithStatus>
    </>
  );
}
