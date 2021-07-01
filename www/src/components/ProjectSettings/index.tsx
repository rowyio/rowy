import { useState, useEffect } from "react";
import _camelCase from "lodash/camelCase";
import _find from "lodash/find";
import _pickBy from "lodash/pickBy";

import { FormDialog } from "@antlerengineering/form-builder";
import { projectSettingsForm } from "./form";

import useDoc, { DocActions } from "hooks/useDoc";
import { IFormDialogProps } from "components/Table/ColumnMenu/NewColumn";

export interface IProjectSettings
  extends Pick<IFormDialogProps, "handleClose"> {}

export default function ProjectSettings({ handleClose }: IProjectSettings) {
  const [settingsState, settingsDispatch] = useDoc({
    path: "_FIRETABLE_/settings",
  });
  const [publicSettingsState, publicSettingsDispatch] = useDoc({
    path: "_FIRETABLE_/publicSettings",
  });

  if (settingsState.loading || publicSettingsState.loading) return null;

  const handleSubmit = (v) => {
    const { signInOptions, ...values } = v;

    settingsDispatch({ action: DocActions.update, data: values });
    publicSettingsDispatch({
      action: DocActions.update,
      data: { signInOptions },
    });
  };

  return (
    <FormDialog
      onClose={handleClose}
      open
      title="Project Settings"
      fields={projectSettingsForm}
      values={{ ...settingsState.doc, ...publicSettingsState.doc }}
      onSubmit={handleSubmit}
      SubmitButtonProps={{ children: "Save" }}
    />
  );
}
