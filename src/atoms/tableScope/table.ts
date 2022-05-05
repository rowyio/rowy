import { atom } from "jotai";
import { uniqBy } from "lodash-es";

import {
  TableSettings,
  TableSchema,
  TableFilter,
  TableOrder,
  TableRow,
} from "@src/types/table";

export const tableIdAtom = atom<string | undefined>(undefined);
export const tableSettingsAtom = atom<TableSettings | undefined>(undefined);
export const tableSchemaAtom = atom<TableSchema | undefined>(undefined);

export const tableFiltersAtom = atom<TableFilter[]>([]);
export const tableOrdersAtom = atom<TableOrder[]>([]);
export const tablePageAtom = atom(0);

export const tableRowsLocalAtom = atom<TableRow[]>([]);
export const tableRowsDbAtom = atom<TableRow[]>([]);
export const tableRowsAtom = atom<TableRow[]>((get) =>
  uniqBy(
    [...get(tableRowsLocalAtom), ...get(tableRowsDbAtom)],
    "_rowy_ref.path"
  )
);
export const tableLoadingMoreAtom = atom(false);
