import { atom } from "jotai";
import type { User } from "firebase/auth";

/** Currently signed in user. `undefined` means loading. */
export const currentUserAtom = atom<User | null | undefined>(undefined);

/** User roles from Firebase Auth user custom claims */
export const userRolesAtom = atom<string[]>([]);
