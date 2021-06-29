import { Box, Button, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { parseSparkConfig, serialiseSpark, ISpark } from "./utils";
import EmptyState from "components/EmptyState";
import BackIcon from "@material-ui/icons/ArrowBack";
import Modal from "components/Modal";

export interface ISparkModalProps {
  // sparks: ISpark[];
  handleClose: () => void;
  handleSave: () => void;
}

export default function SparkModal({
  handleClose,
  handleSave,
}: ISparkModalProps) {
  return (
    <Modal
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      title={
        <Button
          color="secondary"
          startIcon={<BackIcon />}
          onClick={handleClose}
        >
          SPARKS
        </Button>
      }
      children={<>test</>}
      actions={{
        primary: {
          children: "Update Settings",
          onClick: handleSave,
        },
      }}
    />
  );
}
