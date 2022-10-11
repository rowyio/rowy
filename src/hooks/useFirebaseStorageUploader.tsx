import { useReducer } from "react";
import { useAtom } from "jotai";
import { useSnackbar } from "notistack";
import type { DocumentReference } from "firebase/firestore";
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
import { FileValue } from "@src/types/table";

export type UploaderState = {
  progress: number;
  isLoading: boolean;
  error?: string;
};

const initialState: UploaderState = { progress: 0, isLoading: false };
const uploadReducer = (
  prevState: UploaderState,
  newProps: Partial<UploaderState>
) => ({ ...prevState, ...newProps });

export type UploadProps = {
  docRef: DocumentReference;
  fieldName: string;
  files: File[];
  onComplete?: (value: FileValue) => void;
};

// TODO: GENERALIZE INTO ATOM
const useFirebaseStorageUploader = () => {
  const [firebaseStorage] = useAtom(firebaseStorageAtom, projectScope);
  const { enqueueSnackbar } = useSnackbar();

  const [uploaderState, uploaderDispatch] = useReducer(uploadReducer, {
    ...initialState,
  });

  const upload = ({ docRef, fieldName, files, onComplete }: UploadProps) => {
    uploaderDispatch({ isLoading: true });

    files.forEach((file) => {
      const storageRef = ref(
        firebaseStorage,
        `${docRef.path}/${fieldName}/${file.name}`
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
          uploaderDispatch({ progress });
          console.log("Upload is " + progress + "% done");

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },

        // error – must be any to access error.code
        (error: any) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              enqueueSnackbar("Unknown error occurred", { variant: "error" });
              uploaderDispatch({ error: error.serverResponse });
              break;

            case "storage/unauthorized":
              // User doesn't have permission to access the object
              enqueueSnackbar("You don’t have permissions to upload files", {
                variant: "error",
                action: (
                  <Paper elevation={0} sx={{ borderRadius: 1 }}>
                    <Button
                      color="primary"
                      href={
                        WIKI_LINKS.setupRoles +
                        "#write-firebase-storage-security-rules"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Fix
                      <InlineOpenInNewIcon />
                    </Button>
                  </Paper>
                ),
              });
              uploaderDispatch({ error: error.code });
              break;

            case "storage/canceled":
              // User canceled the upload
              uploaderDispatch({ error: error.code });
              break;

            default:
              uploaderDispatch({ error: error.code });
              // Unknown error occurred, inspect error.serverResponse
              break;
          }

          uploaderDispatch({ isLoading: false });
        },

        // complete
        () => {
          uploaderDispatch({ isLoading: false });

          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then(
            (downloadURL: string) => {
              // STore in the document if docRef provided
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
              if (onComplete) onComplete(obj);
            }
          );
        }
      );
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
