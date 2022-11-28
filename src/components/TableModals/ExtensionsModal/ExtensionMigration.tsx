import { useState } from "react";
import { useAtom } from "jotai";
import { deleteField } from "firebase/firestore";

import { Button, Link, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import DownloadIcon from "@mui/icons-material/FileDownloadOutlined";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import GoIcon from "@mui/icons-material/ChevronRight";

import Modal from "@src/components/Modal";

import { projectScope, currentUserAtom } from "@src/atoms/projectScope";
import {
  tableScope,
  tableSettingsAtom,
  tableSchemaAtom,
  updateTableSchemaAtom,
} from "@src/atoms/tableScope";
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
  const [currentUser] = useAtom(currentUserAtom, projectScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [updateTableSchema] = useAtom(updateTableSchemaAtom, tableScope);

  const [isSaved, setIsSaved] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const currentEditor = () => ({
    displayName: currentUser?.displayName ?? "Unknown user",
    photoURL: currentUser?.photoURL ?? "",
    lastUpdate: Date.now(),
  });

  const downloadSparkFile = () => {
    const tablePathTokens =
      tableSettings.collection.split("/").filter(function (_, i) {
        // replace IDs with dash that appears at even indexes
        return i % 2 === 0;
      }) ?? [];
    const tablePath = tablePathTokens.join("-");

    // https://medium.com/front-end-weekly/text-file-download-in-react-a8b28a580c0d
    const element = document.createElement("a");
    const file = new Blob([tableSchema.sparks ?? ""], {
      type: "text/plain;charset=utf-8",
    });
    element.href = URL.createObjectURL(file);
    element.download = `sparks-${tablePath}.ts`;
    document.body.appendChild(element);
    element.click();
    setIsSaved(true);
  };

  const upgradeToExtensions = async () => {
    setIsUpgrading(true);
    const extensionObjects = sparkToExtensionObjects(
      tableSchema.sparks ?? "[]",
      currentEditor()
    );
    console.log(extensionObjects);
    if (updateTableSchema)
      await updateTableSchema({
        extensionObjects,
        sparks: deleteField() as any,
      });
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
