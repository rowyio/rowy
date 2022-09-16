import { memo } from "react";

import useFirestoreCollectionWithAtom from "@src/hooks/useFirestoreCollectionWithAtom";
import {
  projectScope,
  FunctionsIndexAtom,
  updateFunctionAtom,
} from "@src/atoms/projectScope";
import { FUNCTION_SCHEMAS } from "@src/config/dbPaths";

const FunctionsSource = memo(function FunctionsSource() {
  useFirestoreCollectionWithAtom(
    FunctionsIndexAtom,
    projectScope,
    FUNCTION_SCHEMAS,
    {
      updateDocAtom: updateFunctionAtom,
    }
  );
  return null;
});

export default FunctionsSource;
