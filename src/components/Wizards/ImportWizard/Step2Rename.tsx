import { useState } from "react";

import { makeStyles, createStyles } from "@mui/styles";
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
import FadeList from "../ScrollableList";
import Column from "../Column";

const useStyles = makeStyles((theme) =>
  createStyles({
    spacer: { width: theme.spacing(3) },

    buttonBase: {
      width: "100%",
      textAlign: "left",
    },

    doneButton: { padding: theme.spacing(1) },

    textField: { margin: 0 },
    inputBaseRoot: {
      paddingRight: 1,
      borderRadius: 0,
      boxShadow: `0 0 0 1px inset ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.default + " !important",

      ...theme.typography.subtitle2,
    },
    inputHiddenLabel: {
      paddingTop: theme.spacing(15 / 8),
      paddingBottom: theme.spacing(14 / 8),
      paddingLeft: theme.spacing(17 / 8),
    },
  })
);

export default function Step2Rename({
  config,
  updateConfig,
  isXs,
}: IStepProps) {
  const classes = useStyles();

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

      <FadeList>
        {Object.entries(config).map(([field, { name }]) => (
          <Grid container key={field} component="li" wrap="nowrap">
            {!isXs && (
              <Grid item xs>
                <Column label={field} />
              </Grid>
            )}
            {!isXs && <Grid item className={classes.spacer} />}
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
                          className={classes.doneButton}
                          onClick={handleRename}
                        >
                          <DoneIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                    classes: {
                      root: classes.inputBaseRoot,
                      inputHiddenLabel: classes.inputHiddenLabel,
                    },
                  }}
                  hiddenLabel
                  fullWidth
                  autoFocus
                  classes={{ root: classes.textField }}
                />
              ) : (
                <ButtonBase
                  className={classes.buttonBase}
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
      </FadeList>
    </div>
  );
}
