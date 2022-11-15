import { useCallback } from "react";
import { useSetAtom } from "jotai";
import { some } from "lodash-es";

import { tableScope, updateFieldAtom } from "@src/atoms/tableScope";
import useUploader from "@src/hooks/useFirebaseStorageUploader";
import { FileValue } from "@src/types/table";

export default function useFileUpload(docRef: any, fieldName: string) {
  const updateField = useSetAtom(updateFieldAtom, tableScope);
  const { uploaderState, upload, deleteUpload } = useUploader();

  const uploadingFiles = Object.keys(uploaderState);

  const progress =
    uploadingFiles.length > 0
      ? uploadingFiles.reduce((sum, fileName) => {
          const fileState = uploaderState[fileName];
          return sum + fileState.progress;
        }, 0) / uploadingFiles.length
      : 0;

  const loading = some(
    uploadingFiles,
    (fileName) => uploaderState[fileName].loading
  );

  const handleUpload = useCallback(
    async (files: File[]) => {
      const { uploads, failures } = await upload({
        docRef,
        fieldName,
        files,
      });
      updateField({
        path: docRef.path,
        fieldName,
        value: uploads,
        useArrayUnion: true,
      });
      return { uploads, failures };
    },
    [docRef, fieldName, updateField, upload]
  );

  const handleDelete = useCallback(
    (file: FileValue) => {
      updateField({
        path: docRef.path,
        fieldName,
        value: [file],
        useArrayRemove: true,
        disableCheckEquality: true,
      });
      deleteUpload(file);
    },
    [deleteUpload, docRef, fieldName, updateField]
  );

  return { progress, loading, uploaderState, handleUpload, handleDelete };
}
