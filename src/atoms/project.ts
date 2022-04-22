import { atom } from "jotai";
import { DocumentData } from "firebase/firestore";

export const projectIdAtom = atom<string>("");
export const publicSettingsAtom = atom<DocumentData>({});
export const projectSettingsAtom = atom<DocumentData>({});
