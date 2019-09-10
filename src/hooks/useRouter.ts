import { useContext } from "react";
import { __RouterContext } from "react-router";
// used to transform routerContext into a hook
// TODO : find alternate solution as this uses an internal variable
export default function useRouter() {
  return useContext(__RouterContext);
}
