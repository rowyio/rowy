import { atom } from "jotai";
import type { User } from "firebase/auth";

/** Currently signed in user. `undefined` means loading. */
export const currentUserAtom = atom<User | null | undefined>(undefined);

export const userRolesAtom = atom<string[]>([]);
