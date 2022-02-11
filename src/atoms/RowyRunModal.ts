import { atom, useAtom } from "jotai";

export const rowyRunModalAtom = atom({ open: false, feature: "", version: "" });

export const useRowyRunModal = () => {
  const [, setOpen] = useAtom(rowyRunModalAtom);

  return (feature: string = "", version: string = "") =>
    setOpen({ open: true, feature, version });
};
