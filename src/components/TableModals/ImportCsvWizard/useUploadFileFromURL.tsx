import { useCallback, useRef } from "react";
import { useSetAtom } from "jotai";
import { useSnackbar } from "notistack";
import Button from "@mui/material/Button";

import useUploader from "@src/hooks/useFirebaseStorageUploader";
import { tableScope, updateFieldAtom } from "@src/atoms/tableScope";
import { TableRowRef } from "@src/types/table";

const MAX_PARALLEL_TASKS = 30;

type UploadParamTypes = {
  docRef: TableRowRef;
  fieldName: string;
  files: RowyFile[];
};

export default function useUploadFileFromURL() {
  const { upload } = useUploader();
  const updateField = useSetAtom(updateFieldAtom, tableScope);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const jobs = useRef<UploadParamTypes[]>([]);

  const askPermission = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      enqueueSnackbar("Upload files to firebase storage?", {
        persist: true,
        preventDuplicate: true,
        action: (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                closeSnackbar();
                resolve(true);
              }}
              style={{
                marginRight: 8,
              }}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                closeSnackbar();
                resolve(false);
              }}
            >
              No
            </Button>
          </>
        ),
      });
    });
  }, [enqueueSnackbar, closeSnackbar]);

  const handleUpload = useCallback(
    async ({
      docRef,
      fieldName,
      files,
    }: UploadParamTypes): Promise<boolean> => {
      try {
        const files_ = await getFileFromURL(
          files.map((file) => file.downloadURL)
        );
        const { uploads, failures } = await upload({
          docRef,
          fieldName,
          files: files_,
        });
        if (failures.length > 0) {
          return false;
        }
        updateField({
          path: docRef.path,
          fieldName,
          value: uploads,
          useArrayUnion: false,
        });
        return true;
      } catch (error) {
        return false;
      }
    },
    [upload, updateField]
  );

  const batchUpload = useCallback(
    async (batch: UploadParamTypes[]) => {
      await Promise.all(batch.map((job) => handleUpload(job)));
    },
    [handleUpload]
  );

  const runBatchUpload = useCallback(
    async (setProgress?: any) => {
      let currentJobs: UploadParamTypes[] = [];

      while (
        currentJobs.length < MAX_PARALLEL_TASKS &&
        jobs.current.length > 0
      ) {
        const job = jobs.current.shift();
        if (job) {
          currentJobs.push(job);
        }
      }

      if (setProgress) setProgress((p: number) => p + currentJobs.length);
      await batchUpload(currentJobs);

      if (jobs.current.length > 0) {
        runBatchUpload();
      }
    },
    [batchUpload]
  );

  const addTask = useCallback((job: UploadParamTypes) => {
    jobs.current.push(job);
  }, []);

  return {
    addTask,
    runBatchUpload,
    askPermission,
  };
}

function getFileFromURL(urls: string[]): Promise<File[]> {
  const promises = urls.map((url) => {
    return fetch(url)
      .then((response) => response.blob())
      .then((blob) => new File([blob], +new Date() + url, { type: blob.type }));
  });
  return Promise.all(promises);
}
