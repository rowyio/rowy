import React, { useState } from "react";
import _isEqual from "lodash/isEqual";
import { sparkToExtensionObjects } from "./utils";
import Modal from "components/Modal";
import { useFiretableContext } from "contexts/FiretableContext";
import { useAppContext } from "contexts/AppContext";
import firebase from "firebase/app";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modalRoot: {
    height: `calc(100vh - 200px)`,
  },
  download: {
    maxWidth: 320,
    marginTop: theme.spacing(0.5),
  },
}));

export interface IExtensionMigrationProps {
  handleClose: () => void;
  handleUpgradeComplete: () => void;
}

export default function ExtensionMigration({
  handleClose,
  handleUpgradeComplete,
}: IExtensionMigrationProps) {
  const classes = useStyles();
  const { tableState, tableActions } = useFiretableContext();
  const appContext = useAppContext();
  const [isSaved, setIsSaved] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const currentEditor = () => ({
    displayName: appContext?.currentUser?.displayName ?? "Unknown user",
    photoURL: appContext?.currentUser?.photoURL ?? "",
    lastUpdate: Date.now(),
  });

  const downloadSparkFile = () => {
    const tablePathTokens =
      tableState?.tablePath?.split("/").filter(function (_, i) {
        // replace IDs with dash that appears at even indexes
        return i % 2 === 0;
      }) ?? [];
    const tablePath = tablePathTokens.join("-");

    // https://medium.com/front-end-weekly/text-file-download-in-react-a8b28a580c0d
    const element = document.createElement("a");
    const file = new Blob([tableState?.config.sparks ?? ""], {
      type: "text/plain;charset=utf-8",
    });
    element.href = URL.createObjectURL(file);
    element.download = `sparks-${tablePath}.ts`;
    document.body.appendChild(element);
    element.click();
    setIsSaved(true);
  };

  const upgradeToExtensions = () => {
    setIsUpgrading(true);
    const extensionObjects = sparkToExtensionObjects(
      tableState?.config.sparks ?? "[]",
      currentEditor()
    );
    console.log(extensionObjects);
    tableActions?.table.updateConfig("extensionObjects", extensionObjects);
    tableActions?.table.updateConfig(
      "sparks",
      firebase.firestore.FieldValue.delete()
    );
    setTimeout(handleUpgradeComplete, 500);
  };

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
          <Typography variant="body2">
            We have upgraded spark editor to extension editor with a better UI.
            The old sparks are not compatible with this change, however you can
            use this tool to upgrade your sparks.
          </Typography>
          <br />

          <Typography variant="overline">
            1. Save your sparks for backup
          </Typography>
          <Typography variant="body2">
            You must save your sparks before upgrade.
          </Typography>
          <Button
            className={classes.download}
            variant="contained"
            color={isSaved ? "secondary" : "primary"}
            onClick={downloadSparkFile}
          >
            Save sparks
          </Button>
          <br />

          <Typography variant="overline">
            2. Upgrade sparks to extensions
          </Typography>
          {/* TODO add documentation link */}
          <Typography variant="body2">
            After the upgrade, your old sparks will be removed from database.
            And you might need to do some manual change to the code. See this
            documentation for more information.
          </Typography>
          <Button
            className={classes.download}
            variant="contained"
            onClick={upgradeToExtensions}
            disabled={!isSaved || isUpgrading}
            startIcon={
              isUpgrading && <CircularProgress size={20} thickness={5} />
            }
          >
            {isUpgrading && "Upgrading..."}
            {!isUpgrading && "Upgrade to extensions"}
          </Button>
        </Box>
      }
    />
  );
}
