import {
  FirebaseStorage,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

export const uploadTableThumbnail =
  (storage: FirebaseStorage) => (tableId: string, imageFile: File) => {
    const storageRef = ref(storage, `__thumbnails__/${tableId}`);
    return uploadBytes(storageRef, imageFile).then(({ ref }) =>
      getDownloadURL(ref)
    );
  };
