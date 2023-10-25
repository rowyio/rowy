import React, { useState } from "react";
import Modal from "@src/components/Modal";
import { Box, Button, TextField, Typography } from "@mui/material";
import { capitalize } from "lodash-es";
import LoadingButton from "@mui/lab/LoadingButton";

export interface ISecretDetailsModalProps {
  open: boolean;
  loading?: boolean;
  mode?: "add" | "edit" | "delete";
  error?: string;
  secretName?: string;
  handleClose: () => void;
  handleAdd: (secretName: string, secretValue: string) => void;
  handleEdit: (secretName: string, secretValue: string) => void;
  handleDelete: (secretName: string) => void;
}

export default function SecretDetailsModal({
  open,
  loading,
  mode,
  error,
  secretName,
  handleClose,
  handleAdd,
  handleEdit,
  handleDelete,
}: ISecretDetailsModalProps) {
  const [newSecretName, setNewSecretName] = useState("");
  const [secretValue, setSecretValue] = useState("");

  return (
    <Modal
      onClose={handleClose}
      open={open}
      maxWidth="xs"
      fullWidth
      title={`${capitalize(mode)} secret key`}
      sx={{
        ".MuiDialogContent-root": {
          display: "flex",
          flexDirection: "column",
          height: "100%",
        },
      }}
      children={
        <Box
          sx={{
            marginTop: 1,
          }}
        >
          {mode === "add" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                gap: 1,
              }}
            >
              <Typography variant="subtitle2">Secret Name</Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={newSecretName}
                onChange={(e) => setNewSecretName(e.target.value)}
              />
              <Typography
                variant={"body2"}
                color={"text.secondary"}
                fontSize={"12px"}
              >
                This will create a secret key on Google Cloud.
              </Typography>
            </Box>
          )}
          {mode === "delete" ? (
            <Typography>
              Are you sure you want to delete this secret key {secretName}?
            </Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                gap: 1,
                marginTop: 2,
              }}
            >
              <Typography variant="subtitle2">Secret Value</Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={secretValue}
                onChange={(e) => setSecretValue(e.target.value)}
              />
              <Typography
                variant={"body2"}
                color={"text.secondary"}
                fontSize={"12px"}
              >
                Paste your secret key here.
              </Typography>
            </Box>
          )}
          {error?.length && (
            <Typography color={"error"} marginTop={2}>
              {error}
            </Typography>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              gap: 1,
              marginTop: 4,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              color={"primary"}
              loading={loading}
              disabled={
                (mode === "add" && (!newSecretName || !secretValue)) ||
                (mode === "edit" && !secretValue)
              }
              onClick={() => {
                switch (mode) {
                  case "add":
                    handleAdd(newSecretName, secretValue);
                    break;
                  case "edit":
                    handleEdit(secretName ?? "", secretValue);
                    break;
                  case "delete":
                    handleDelete(secretName ?? "");
                    break;
                }
              }}
            >
              {mode === "delete" ? "Delete" : "Save"}
            </LoadingButton>
          </Box>
        </Box>
      }
    />
  );
}
