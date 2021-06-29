import { useReducer } from "react";
import firebase from "firebase/app";
import { bucket } from "../../firebase/index";

export type UploaderState = {
  progress: number;
  isLoading: boolean;
  error?: string;
};
export type FileValue = {
  ref: string;
  downloadURL: string;
  name: string;
  type: string;
  lastModifiedTS: number;
};

const initialState: UploaderState = { progress: 0, isLoading: false };
const uploadReducer = (
  prevState: UploaderState,
  newProps: Partial<UploaderState>
) => ({ ...prevState, ...newProps });

export type UploadProps = {
  docRef: firebase.firestore.DocumentReference;
  fieldName: string;
  files: File[];
  previousValue?: FileValue[];
  onComplete?: (values: FileValue[]) => void;
};

const useUploader = () => {
  const [uploaderState, uploaderDispatch] = useReducer(uploadReducer, {
    ...initialState,
  });

  const upload = ({
    docRef,
    fieldName,
    files,
    previousValue,
    onComplete,
  }: UploadProps) => {
    uploaderDispatch({ isLoading: true });

    files.forEach((file) => {
      const storageRef = bucket.ref(`${docRef.path}/${fieldName}/${file.name}`);
      const uploadTask = storageRef.put(file);

      uploadTask.on(
        // event
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        // observer
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          uploaderDispatch({ progress });
          console.log("Upload is " + progress + "% done");

          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
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
              uploaderDispatch({ error: error.serverResponse });
              break;

            case "storage/unauthorized":
            // User doesn't have permission to access the object
            case "storage/canceled":
            // User canceled the upload
            default:
              uploaderDispatch({ error: error.code });
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },

        // complete
        () => {
          uploaderDispatch({ isLoading: false });

          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((downloadURL: string) => {
              const newValue: FileValue[] = Array.isArray(previousValue)
                ? previousValue
                : [];

              newValue.push({
                ref: uploadTask.snapshot.ref.fullPath,
                downloadURL,
                name: file.name,
                type: file.type,
                lastModifiedTS: file.lastModified,
              });
              // STore in the document if docRef provided
              // if (docRef && docRef.update)docRef.update({ [fieldName]: newValue });
              // Also call callback if it exists
              // IMPORTANT: SideDrawer form may not update its local values after this
              // function updates the doc, so you MUST update it manually
              // using this callback
              if (onComplete) onComplete(newValue);
            });
        }
      );
    });
  };

  const deleteUpload = (fileValue: FileValue) => {
    if (fileValue.ref) return bucket.ref(fileValue.ref).delete();
    else {
      return true;
    }
  };

  return { uploaderState, upload, uploaderDispatch, deleteUpload };
};

export default useUploader;
