import React, { useContext } from "react";

import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Grow,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";

import EditorContext from "contexts/editorContext";

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props, ref) {
    return <Grow ref={ref} {...props} />;
  }
);

export default function EditorModal({ children }: React.PropsWithChildren<{}>) {
  const editorContext = useContext(EditorContext);
  const isOpen = editorContext.editorValue !== null;
  return (
    <Dialog
      open={isOpen}
      onClose={(event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        if (reason === "escapeKeyDown") editorContext.cancel();
      }}
      TransitionComponent={Transition}
    >
      <DialogContent>{children}</DialogContent>

      <DialogActions>
        <Button onClick={editorContext.cancel}>Cancel</Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={editorContext.close}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
