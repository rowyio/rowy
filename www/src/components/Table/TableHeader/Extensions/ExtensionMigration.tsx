import React, { useState } from "react";
import _isEqual from "lodash/isEqual";
import useStateRef from "react-usestateref";
import { IExtension, triggerTypes } from "./utils";
import Modal from "components/Modal";
import CodeEditorHelper from "components/CodeEditorHelper";
import { useConfirmation } from "components/ConfirmationDialog";
import CodeEditor from "../../editors/CodeEditor";
import { useFiretableContext } from "contexts/FiretableContext";
import BackIcon from "@material-ui/icons/ArrowBack";
import AddIcon from "@material-ui/icons/AddBox";
import DeleteIcon from "@material-ui/icons/RemoveCircle";
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  makeStyles,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modalRoot: {
    height: `calc(100vh - 200px)`,
  },
}));

export interface IExtensionMigrationProps {
  handleClose: () => void;
}

export default function ExtensionMigration({
  handleClose,
}: IExtensionMigrationProps) {
  const classes = useStyles();
  const { tableState } = useFiretableContext();

  return (
    <Modal
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      title={"Extensions Migration Guide"}
      children={
        <Box
          display="flex"
          flexDirection="column"
          className={classes.modalRoot}
        >
          sparks config detected. Migration guide implementation to be confirmed
        </Box>
      }
    />
  );
}
