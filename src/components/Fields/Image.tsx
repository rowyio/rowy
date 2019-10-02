import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import useUploader from "../../hooks/useFiretable/useUploader";

import { FieldType } from ".";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/AddAPhoto";
// TODO:  indicate state completion / error
// TODO: Create an interface for props

interface Props {
  value: any;
  row: { ref: firebase.firestore.DocumentReference; id: string };
  onSubmit: Function;
  fieldType: FieldType;
  fieldName: string;
}

const Image = (props: Props) => {
  const { fieldName, value, row } = props;
  const [uploaderState, upload] = useUploader();
  const [localImage, setLocalImage] = useState<string | null>(null);
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    const imageFile = acceptedFiles[0];
    if (imageFile) {
      upload(row.ref, fieldName, [imageFile]);
      let url = URL.createObjectURL(imageFile);
      setLocalImage(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: ["image/png", "image/jpg", "image/jpeg"],
  });
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {localImage ? (
        <div>
          <img style={{ height: "80px" }} src={localImage} />
        </div>
      ) : value ? (
        <img style={{ height: "80px" }} src={value[0].downloadURL} />
      ) : isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <IconButton>
          <AddIcon />
        </IconButton>
      )}
    </div>
  );
};
export default Image;
