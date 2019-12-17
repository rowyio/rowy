import React, { useContext, useRef, useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import EditorContext from "contexts/editorContext";
import { FieldType } from "./Fields";
import ReactQuill, { Quill } from "react-quill";
import { ImageDrop } from "quill-image-drop-module";
import Delta from "quill-delta";
import "react-quill/dist/quill.snow.css";
import { bucket } from "../firebase";

import EditorModel from "./EditorModal";

Quill.register("modules/imageDrop", ImageDrop);

const useStyles = makeStyles(theme =>
  createStyles({
    test: { position: "absolute", top: 10, left: 10 },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      maxWidth: 600,
      width: "100%",
    },
    paper: { padding: theme.spacing(2) },
    root: {
      margin: `${theme.spacing(1)}px 0`,

      "&:focus-within $sectionTitle": {
        color:
          theme.palette.type === "dark"
            ? theme.palette.primary.dark
            : theme.palette.primary.main,
      },
    },
    typography: {
      padding: theme.spacing(2),
    },
    textArea: {
      fontSize: 16,
      minWidth: 230,
      width: "100%",
    },
    quillEditor: {
      minHeight: 100,

      // match styling
      "& .ql-toolbar": {
        borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
        transition: theme.transitions.create("border-color", {
          duration: theme.transitions.duration.shortest,
        }),
      },
      "& .ql-container": {
        borderRadius: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
        transition: theme.transitions.create("border-color", {
          duration: theme.transitions.duration.shortest,
        }),
      },
      "& .ql-editor": {
        minHeight: 100,
        fontFamily: theme.typography.fontFamily,
        fontSize: ".875rem",
        color: theme.palette.text.primary,
        "&.ql-blank::before": {
          fontStyle: "normal",
          color: theme.palette.text.disabled,
        },
      },

      // highlight border on focus
      "&:focus-within .ql-toolbar.ql-snow, &:focus-within .ql-container.ql-snow": {
        borderColor: theme.palette.primary.main,
      },

      // buttons stroke/fill colour matching
      "& .ql-snow.ql-toolbar button, & .ql-snow .ql-picker-label": {
        borderRadius: theme.shape.borderRadius / 2,
        transition: theme.transitions.create("background-color", {
          duration: theme.transitions.duration.shortest,
        }),
      },
      "& .ql-snow .ql-stroke": {
        stroke: theme.palette.text.primary,
        transition: theme.transitions.create("stroke", {
          duration: theme.transitions.duration.shortest,
        }),
      },
      "& .ql-snow .ql-fill": {
        fill: theme.palette.text.primary,
        transition: theme.transitions.create("fill", {
          duration: theme.transitions.duration.shortest,
        }),
      },

      // colour buttons on hover
      "& button:hover .ql-stroke": {
        stroke: `${theme.palette.primary.main} !important`,
      },
      "& button:hover .ql-fill": {
        fill: `${theme.palette.primary.main} !important`,
      },

      // highlight buttons when selected/active
      "& .ql-snow.ql-toolbar .ql-active": {
        backgroundColor: theme.palette.primary.light,
        "& .ql-stroke": {
          stroke: `${theme.palette.primary.main} !important`,
        },
        "& .ql-fill": {
          fill: `${theme.palette.primary.main} !important`,
        },
      },

      // dropdown styling
      "& .ql-snow.ql-toolbar button:hover, & .ql-snow .ql-toolbar button:hover, & .ql-snow.ql-toolbar button:focus, & .ql-snow .ql-toolbar button:focus, & .ql-snow.ql-toolbar button.ql-active, & .ql-snow .ql-toolbar button.ql-active, & .ql-snow.ql-toolbar .ql-picker-label:hover, & .ql-snow .ql-toolbar .ql-picker-label:hover, & .ql-snow.ql-toolbar .ql-picker-label.ql-active, & .ql-snow .ql-toolbar .ql-picker-label.ql-active, & .ql-snow.ql-toolbar .ql-picker-item:hover, & .ql-snow .ql-toolbar .ql-picker-item:hover, & .ql-snow.ql-toolbar .ql-picker-item.ql-selected, & .ql-snow .ql-toolbar .ql-picker-item.ql-selected": {
        color: theme.palette.primary.main,

        "& polygon": { stroke: theme.palette.primary.main + " !important" },
      },
    },
  })
);

async function asyncUploader(ref, file) {
  const documentRef = bucket.ref("RTE").child(ref);
  const snapShot = await documentRef.put(file);
  const downloadUrl = await bucket
    .ref("RTE")
    .child(snapShot.metadata.fullPath)
    .getDownloadURL();
  return downloadUrl;
}
const imageHandler = quillRef => () => {
  const now = new Date();
  const quill = quillRef.current.getEditor();
  let fileInput = document.body.querySelector("input.ql-image[type=file]");
  if (fileInput == null) {
    fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute(
      "accept",
      "image/png, image/gif, image/jpeg, image/bmp, image/x-icon"
    );
    fileInput.classList.add("ql-image");
    fileInput.addEventListener("change", async () => {
      console.log("detected file");
      if (fileInput.files != null && fileInput.files[0] != null) {
        const ref = `quill-images/${now.getTime()}/${fileInput.files[0].name}`;
        const downloadUrl = await asyncUploader(ref, fileInput.files[0]);
        console.log(downloadUrl);
        let range = quill.getSelection(true);
        quill.updateContents(
          new Delta()
            .retain(range.index)
            .delete(range.length)
            .insert({ image: downloadUrl }),
          "user"
        );

        fileInput.value = "";
        document.body.removeChild(fileInput);
      }
    });
    document.body.appendChild(fileInput);
  }
  fileInput.click();
};

const RichTextEditor = props => {
  const classes = useStyles();
  const editorContext = useContext(EditorContext);
  const quillRef = useRef(null);
  useEffect(() => {
    if (quillRef.current) {
      quillRef.current
        .getEditor()
        .getModule("toolbar")
        .addHandler("image", imageHandler(quillRef));
    }
  }, [quillRef]);
  if (editorContext.fieldType !== FieldType.richText) return <></>;
  return (
    <EditorModel>
      <ReactQuill
        //placeholder={placeholder}
        value={editorContext.editorValue}
        ref={quillRef}
        onChange={val => {
          // const dataURLregEx = /"data:.*?"/;
          // let matches = val.match(dataURLregEx);
          // delete matches.index;
          // delete matches.input;
          // delete matches.groups;
          // console.log(matches);
          editorContext.setEditorValue(val);
        }}
        theme="snow"
        className={classes.quillEditor}
        //  preserveWhiteSpace
        modules={{
          // toolbar: [
          //   ['image']
          // ],
          imageDrop: true,
          toolbar: {
            container: [
              ["bold", "italic", "underline"],
              [{ header: [1, 2, 3, 4, false] }],
              [{ list: "bullet" }, { list: "ordered" }],
              [{ indent: "-1" }, { indent: "+1" }],
              ["blockquote", "code-block", "image", "video"],
              ["link"],
            ],
          },
          clipboard: {
            matchVisual: false,
          },
        }}
      />
    </EditorModel>
  );
};
export default RichTextEditor;
