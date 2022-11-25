import { useCallback, useState } from "react";
import { useSetAtom } from "jotai";
import { some } from "lodash-es";
import { DropzoneOptions, useDropzone } from "react-dropzone";

import { tableScope, updateFieldAtom } from "@src/atoms/tableScope";
import useUploader from "@src/hooks/useFirebaseStorageUploader";
import type { FileValue, TableRowRef } from "@src/types/table";

export default function useFileUpload(
  docRef: TableRowRef,
  fieldName: string,
  dropzoneOptions: DropzoneOptions = {}
) {
  const updateField = useSetAtom(updateFieldAtom, tableScope);
  const { uploaderState, upload, deleteUpload } = useUploader();

  const [localFiles, setLocalFiles] = useState<File[]>([]);

  const dropzoneState = useDropzone({
    onDrop: async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setLocalFiles(acceptedFiles);
        await handleUpload(acceptedFiles);
        setLocalFiles([]);
      }
    },
    ...dropzoneOptions,
  });

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

  return {
    localFiles,
    progress,
    loading,
    uploaderState,
    handleUpload,
    handleDelete,
    dropzoneState,
  };
}
