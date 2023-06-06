import { useReducer } from "react";
import { useAtom } from "jotai";
import { useSnackbar } from "notistack";
import {
  ref,
  uploadBytesResumable,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";

import { Paper, Button } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import { projectScope } from "@src/atoms/projectScope";
import { firebaseStorageAtom } from "@src/sources/ProjectSourceFirebase";
import { WIKI_LINKS } from "@src/constants/externalLinks";
import type { FileValue, TableRowRef } from "@src/types/table";
import { generateId } from "@src/utils/table";

export type UploadState = {
  progress: number;
  loading: boolean;
  error?: string;
};

export type UploaderState = {
  [fileName: string]: UploadState;
};

const uploadReducer = (
  prevState: UploaderState,
  action: {
    type: "reset" | "file_update";
    data?: { fileName: string; newProps: Partial<UploadState> };
  }
) => {
  switch (action.type) {
    case "reset":
      return {};
    case "file_update":
      const { fileName, newProps } = action.data!;
      const nextState = { ...prevState };
      nextState[fileName] = {
        ...nextState[fileName],
        ...newProps,
      };
      return nextState;
  }
};

export type UploadProps = {
  docRef: TableRowRef;
  fieldName: string;
  files: File[];
  onComplete?: ({
    uploads,
    failures,
  }: {
    uploads: FileValue[];
    failures: string[];
  }) => void;
};

// TODO: GENERALIZE INTO ATOM
const useFirebaseStorageUploader = () => {
  const [firebaseStorage] = useAtom(firebaseStorageAtom, projectScope);
  const { enqueueSnackbar } = useSnackbar();

  const [uploaderState, uploaderDispatch] = useReducer(uploadReducer, {});

  const upload = ({ docRef, fieldName, files }: UploadProps) => {
    const uploads = [] as FileValue[];
    const failures = [] as string[];
    const isCompleted = () => uploads.length + failures.length === files.length;

    return new Promise((resolve) =>
      files.forEach((file) => {
        uploaderDispatch({
          type: "file_update",
          data: {
            fileName: file.name,
            newProps: { loading: true, progress: 0 },
          },
        });

        const storageRef = ref(
          firebaseStorage,
          `${docRef.path}/${fieldName}/${generateId()}-${file.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, file, {
          cacheControl: "public, max-age=31536000",
        });
        uploadTask.on(
          // event
          "state_changed",
          // observer
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploaderDispatch({
              type: "file_update",
              data: { fileName: file.name, newProps: { progress } },
            });
          },

          // error – must be any to access error.code
          (error: any) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            const errorAction = {
              fileName: file.name,
              newProps: { loading: false } as Partial<UploadState>,
            };
            switch (error.code) {
              case "storage/unknown":
                // Unknown error occurred, inspect error.serverResponse
                enqueueSnackbar("Unknown error occurred", { variant: "error" });
                errorAction.newProps.error = error.serverResponse;
                break;

              case "storage/unauthorized":
                // User doesn't have permission to access the object
                enqueueSnackbar("You don’t have permissions to upload files", {
                  variant: "error",
                  action: (
                    <Paper elevation={0} sx={{ borderRadius: 1 }}>
                      <Button
                        color="primary"
                        href={WIKI_LINKS.faqsAccess + "#unable-to-upload-files"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Learn More
                        <InlineOpenInNewIcon />
                      </Button>
                    </Paper>
                  ),
                });
                errorAction.newProps.error = error.code;
                break;

              case "storage/canceled":
              default:
                errorAction.newProps.error = error.code;
                break;
            }
            failures.push(file.name);
            uploaderDispatch({ type: "file_update", data: errorAction });
            if (isCompleted()) resolve(true);
          },

          // complete
          () => {
            uploaderDispatch({
              type: "file_update",
              data: {
                fileName: file.name,
                newProps: { loading: false },
              },
            });

            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then(
              (downloadURL: string) => {
                // Store in the document if docRef provided
                // if (docRef && docRef.update)docRef.update({ [fieldName]: newValue });
                // Also call callback if it exists
                // IMPORTANT: SideDrawer form may not update its local values after this
                // function updates the doc, so you MUST update it manually
                // using this callback
                const obj = {
                  ref: uploadTask.snapshot.ref.fullPath,
                  downloadURL,
                  name: file.name,
                  type: file.type,
                  lastModifiedTS: file.lastModified,
                };
                uploads.push(obj);
                if (isCompleted()) resolve(true);
              }
            );
          }
        );
      })
    ).then(() => {
      uploaderDispatch({ type: "reset" });
      return { uploads, failures };
    });
  };

  const deleteUpload = (fileValue: FileValue) => {
    if (fileValue.ref) return deleteObject(ref(firebaseStorage, fileValue.ref));
    else {
      return true;
    }
  };

  return { uploaderState, upload, uploaderDispatch, deleteUpload };
};

export default useFirebaseStorageUploader;
