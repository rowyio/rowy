import { memo } from "react";

import useFirestoreCollectionWithAtom from "@src/hooks/useFirestoreCollectionWithAtom";
import {
  projectScope,
  allUsersAtom,
  updateUserAtom,
} from "@src/atoms/projectScope";
import { USERS } from "@src/config/dbPaths";

/**
 * When rendered, provides atom values for top-level tables
 */
const MembersSourceFirebase = memo(function MembersSourceFirebase() {
  useFirestoreCollectionWithAtom(allUsersAtom, projectScope, USERS, {
    updateDocAtom: updateUserAtom,
  });

  return null;
});

export default MembersSourceFirebase;
