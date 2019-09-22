import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import useUploader from "../../hooks/useFiretable/useUploader";

// TODO:  indecate state completion / error
const Image = (props: any) => {
  const { columnData, cellData, cellActions, rowData, rowIndex } = props;
  const [uploaderState, upload] = useUploader();
  const [localImage, setLocalImage] = useState<string | null>(null);
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    const imageFile = acceptedFiles[0];
    if (imageFile) {
      upload(rowData.ref, columnData.fieldName, [imageFile]);
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
          <img style={{ height: "150px" }} src={localImage} />
        </div>
      ) : cellData ? (
        <img style={{ height: "150px" }} src={cellData[0].downloadURL} />
      ) : isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};
export default Image;
