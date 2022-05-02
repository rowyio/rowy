import { where } from "firebase/firestore";

export type TableFilter = {
  key: Parameters<typeof where>[0];
  operator: Parameters<typeof where>[1];
  value: Parameters<typeof where>[2];
};
