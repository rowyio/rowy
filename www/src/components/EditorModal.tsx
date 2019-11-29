import React, { useContext, useRef, useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import EditorContext from "contexts/editorContext";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
const useStyles = makeStyles((theme: Theme) =>
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
interface Props {}

const EditorModel = ({ children }: any) => {
  const classes = useStyles();
  const editorContext = useContext(EditorContext);
  const isOpen = editorContext.editorValue !== null;
  return (
    <Modal
      className={classes.modal}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={isOpen}
      onClose={(event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        if (reason === "escapeKeyDown") editorContext.cancel();
      }}
    >
      <Fade in={isOpen}>
        <Paper className={classes.paper}>
          {children}
          <Grid container justify="space-between">
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={editorContext.close}
            >
              Save
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={editorContext.cancel}
            >
              cancel
            </Button>
          </Grid>
        </Paper>
      </Fade>
    </Modal>
  );
};
export default EditorModel;
