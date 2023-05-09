import { useCallback, useRef } from "react";
import { useSetAtom } from "jotai";
import { SnackbarKey, useSnackbar } from "notistack";
import Button from "@mui/material/Button";

import useUploader from "@src/hooks/useFirebaseStorageUploader";
import { tableScope, updateFieldAtom } from "@src/atoms/tableScope";
import { TableRowRef } from "@src/types/table";
import SnackbarProgress from "@src/components/SnackbarProgress";

const MAX_CONCURRENT_TASKS = 1000;

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
        await updateField({
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
      await Promise.all(
        batch.map((job) =>
          handleUpload(job).then(() => {
            snackbarProgressRef.current?.setProgress((p: number) => p + 1);
          })
        )
      );
    },
    [handleUpload]
  );

  const snackbarProgressRef = useRef<any>(null);
  const snackbarProgressId = useRef<SnackbarKey | null>(null);
  const showProgress = useCallback(
    (totalJobs: number) => {
      snackbarProgressId.current = enqueueSnackbar(
        `Uploading files form ${Number(
          totalJobs
        ).toLocaleString()} cells. This might take a while.`,
        {
          persist: true,
          action: (
            <SnackbarProgress
              stateRef={snackbarProgressRef}
              target={totalJobs}
              label=" completed"
            />
          ),
        }
      );
    },
    [enqueueSnackbar]
  );

  const runBatchedUpload = useCallback(async () => {
    if (!snackbarProgressId.current) {
      showProgress(jobs.current.length);
    }
    let currentJobs: UploadParamTypes[] = [];

    while (
      currentJobs.length < MAX_CONCURRENT_TASKS &&
      jobs.current.length > 0
    ) {
      const job = jobs.current.shift();
      if (job) {
        currentJobs.push(job);
      }
    }

    await batchUpload(currentJobs);

    if (jobs.current.length > 0) {
      await runBatchedUpload();
    }

    if (snackbarProgressId.current) {
      closeSnackbar(snackbarProgressId.current);
    }
  }, [batchUpload, closeSnackbar, showProgress, snackbarProgressId]);

  const addTask = useCallback((job: UploadParamTypes) => {
    jobs.current.push(job);
  }, []);

  const hasUploadJobs = () => jobs.current.length > 0;
  return {
    addTask,
    runBatchedUpload,
    askPermission,
    hasUploadJobs,
  };
}

function getFileFromURL(urls: string[]): Promise<File[]> {
  const promises = urls.map((url) => {
    return fetch(url)
      .then((response) => response.blob())
      .then((blob) => new File([blob], +new Date() + "", { type: blob.type }));
  });
  return Promise.all(promises);
}
