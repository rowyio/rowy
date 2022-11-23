import { useState } from "react";

import {
  Grid,
  Typography,
  Divider,
  IconButton,
  ButtonBase,
  TextField,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

import { IStepProps } from ".";
import ScrollableList from "@src/components/TableModals/ScrollableList";
import Column, {
  COLUMN_HEADER_HEIGHT,
} from "@src/components/Table/Mock/Column";

export default function Step2Rename({
  config,
  updateConfig,
  isXs,
}: IStepProps) {
  const [fieldToRename, setFieldToRename] = useState("");
  const [renameTextField, setRenameTextField] = useState("");
  const handleRename = () => {
    updateConfig({ [fieldToRename]: { name: renameTextField } });
    setFieldToRename("");
    setRenameTextField("");
  };

  return (
    <div>
      <Grid container spacing={3}>
        {!isXs && (
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom component="h2">
              Field names
            </Typography>
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" gutterBottom component="h2">
            Set column names
          </Typography>
        </Grid>
      </Grid>

      <Divider />

      <ScrollableList>
        {Object.entries(config).map(([field, { name }]) => (
          <Grid container key={field} component="li" wrap="nowrap">
            {!isXs && (
              <Grid item xs>
                <Column label={field} />
              </Grid>
            )}
            {!isXs && <Grid item sx={{ width: (theme) => theme.spacing(3) }} />}
            <Grid item xs>
              {fieldToRename === field ? (
                <TextField
                  value={renameTextField}
                  onChange={(e) => setRenameTextField(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename();
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Finished fieldToRename"
                          color="primary"
                          sx={{ padding: 1 }}
                          onClick={handleRename}
                        >
                          <DoneIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      pr: 0.25,
                      borderRadius: 0,
                      // boxShadow: (theme) =>
                      //   `0 0 0 1px inset ${theme.palette.divider}`,
                      // backgroundColor: "background.default",

                      "& .MuiFilledInput-input": {
                        typography: "caption",
                        fontWeight: "medium",
                        height: COLUMN_HEADER_HEIGHT,
                        boxSizing: "border-box",
                      },

                      // "& .MuiFilledInput-inputHiddenLabel": {
                      //   pt: 15 / 8,
                      //   pb: 14 / 8,
                      //   pl: 17 / 8,
                      // },
                    },
                  }}
                  hiddenLabel
                  fullWidth
                  autoFocus
                  style={{ margin: 0 }}
                />
              ) : (
                <ButtonBase
                  style={{ width: "100%", textAlign: "left" }}
                  onClick={() => {
                    setFieldToRename(field);
                    setRenameTextField(name);
                  }}
                  aria-label={`Rename column ${field}`}
                  focusRipple
                >
                  <Column label={name} secondaryItem={<EditIcon />} />
                </ButtonBase>
              )}
            </Grid>
          </Grid>
        ))}
      </ScrollableList>
    </div>
  );
}
