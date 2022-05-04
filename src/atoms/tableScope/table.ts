import { atom } from "jotai";
import {
  TableSettings,
  TableSchema,
  TableFilter,
  TableOrder,
} from "@src/types/table";

export const tableIdAtom = atom<string | undefined>(undefined);
export const tableSettingsAtom = atom<TableSettings | undefined>(undefined);
export const tableSchemaAtom = atom<TableSchema | undefined>(undefined);

export const tableFiltersAtom = atom<TableFilter[]>([]);
export const tableOrdersAtom = atom<TableOrder[]>([]);
export const tablePageAtom = atom(0);

export const tableRowsAtom = atom<Record<string, any>[]>([]);
export const tableLoadingMoreAtom = atom(false);
