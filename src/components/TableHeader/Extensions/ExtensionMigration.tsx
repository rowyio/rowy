import { useState } from "react";
import firebase from "firebase/app";

import { Button, Link, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import DownloadIcon from "@mui/icons-material/FileDownloadOutlined";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import GoIcon from "@mui/icons-material/ChevronRight";

import Modal from "@src/components/Modal";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { useAppContext } from "@src/contexts/AppContext";
import { sparkToExtensionObjects } from "./utils";
import { WIKI_LINKS } from "@src/constants/externalLinks";

export interface IExtensionMigrationProps {
  handleClose: () => void;
  handleUpgradeComplete: () => void;
}

export default function ExtensionMigration({
  handleClose,
  handleUpgradeComplete,
}: IExtensionMigrationProps) {
  const appContext = useAppContext();
  const { tableState, tableActions } = useProjectContext();

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
      maxWidth="xs"
      fullWidth
      disableBackdropClick
      disableEscapeKeyDown
      title="Welcome to Extensions"
      children={
        <>
          <div>
            <Typography paragraph>
              It looks like you have Sparks configured for this table.
            </Typography>
            <Typography>
              Sparks have been revamped to Extensions, with a brand new UI. Your
              existing Sparks are not compatible with this change, but you can
              migrate your Sparks to Extensions.
            </Typography>
          </div>

          <div>
            <Typography variant="subtitle1" component="h3" gutterBottom>
              1. Back up existing Sparks
            </Typography>
            <Typography paragraph>
              Back up your existing Sparks to a .ts file.
            </Typography>
            <Button
              variant={isSaved ? "outlined" : "contained"}
              color={isSaved ? "secondary" : "primary"}
              onClick={downloadSparkFile}
              endIcon={<DownloadIcon />}
              style={{ width: "100%" }}
            >
              Save Sparks
            </Button>
          </div>

          <div>
            <Typography variant="subtitle1" component="h3" gutterBottom>
              2. Migrate Sparks to Extensions
            </Typography>

            <Typography gutterBottom>
              After the upgrade, Sparks will be removed from this table. You may
              need to make manual changes to your Extensions code.
            </Typography>

            <Link
              href={WIKI_LINKS.extensions}
              target="_blank"
              rel="noopener noreferrer"
              paragraph
              display="block"
            >
              Read the Extensions documentation
              <InlineOpenInNewIcon />
            </Link>

            <LoadingButton
              variant="contained"
              color="primary"
              loading={isUpgrading}
              loadingPosition="end"
              onClick={upgradeToExtensions}
              disabled={!isSaved || isUpgrading}
              endIcon={<GoIcon />}
              style={{ width: "100%" }}
            >
              Migrate to Extensions
            </LoadingButton>
          </div>
        </>
      }
    />
  );
}
