import { atomWithHash } from "jotai/utils";

export const modalAtom = atomWithHash<
  "cloudLogs" | "extensions" | "webhooks" | "export" | ""
>("modal", "");
