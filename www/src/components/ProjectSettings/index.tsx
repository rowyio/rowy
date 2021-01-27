import React, { useState, useEffect } from "react";
import _camelCase from "lodash/camelCase";
import _find from "lodash/find";

import { makeStyles, createStyles } from "@material-ui/core";

import { FormDialog } from "@antlerengineering/form-builder";
import { settings } from "./form";

import useDoc, { DocActions } from "hooks/useDoc";

const FORM_EMPTY_STATE = {
  cloudBuild: {
    branch: "test",
    triggerId: "",
  },
};

const useStyles = makeStyles((theme) =>
  createStyles({
    buttonGrid: { padding: theme.spacing(3, 0) },
    button: { width: 160 },

    formFooter: {
      marginTop: theme.spacing(4),

      "& button": {
        paddingLeft: theme.spacing(1.5),
        display: "flex",
      },
    },
    collectionName: { fontFamily: theme.typography.fontFamilyMono },
  })
);

export default function SettingsDialog({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const [settingsDocState, settingsDocDispatch] = useDoc({
    path: "_FIRETABLE_/settings",
  });

  const [formState, setForm] = useState<any>();

  useEffect(() => {
    if (!settingsDocState.loading) {
      const cloudBuild = settingsDocState?.doc?.cloudBuild;
      setForm(cloudBuild ? { cloudBuild } : FORM_EMPTY_STATE);
    }
  }, [settingsDocState.doc, open]);

  const handleSubmit = (values) => {
    settingsDocDispatch({ action: DocActions.update, data: values });
    handleClose();
  };

  if (!formState) return <></>;
  return (
    <>
      <FormDialog
        onClose={handleClose}
        open={open}
        title={"Project Settings"}
        fields={settings()}
        values={formState}
        onSubmit={handleSubmit}
      />
    </>
  );
}
