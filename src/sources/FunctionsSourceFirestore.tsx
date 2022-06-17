import { memo } from "react";

import useFirestoreCollectionWithAtom from "@src/hooks/useFirestoreCollectionWithAtom";
import {
  globalScope,
  FunctionsIndexAtom,
  updateFunctionAtom,
} from "@src/atoms/globalScope";
import { FUNCTION_SCHEMAS } from "@src/config/dbPaths";

const FunctionsSource = memo(function FunctionsSource() {
  useFirestoreCollectionWithAtom(
    FunctionsIndexAtom,
    globalScope,
    FUNCTION_SCHEMAS,
    {
      updateDocAtom: updateFunctionAtom,
    }
  );
  return null;
});

export default FunctionsSource;
