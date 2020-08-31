import React, { useState } from "react";

import {
  makeStyles,
  createStyles,
  Grid,
  Typography,
  Divider,
  ButtonBase,
  IconButton,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import { IStepProps } from ".";
import FadeList from "./FadeList";
import Column from "./Column";
import FieldsDropdown from "components/Table/ColumnMenu/FieldsDropdown";

const useStyles = makeStyles((theme) =>
  createStyles({
    buttonBase: {
      width: "100%",
      textAlign: "left",
    },
  })
);

export default function Step3Types({ config, updateConfig }: IStepProps) {
  const classes = useStyles();

  const [fieldToEdit, setFieldToEdit] = useState(Object.keys(config)[0]);

  const handleChange = (e) =>
    updateConfig({ [fieldToEdit]: { type: e.target.value } });

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="overline" gutterBottom component="h2">
            Firetable Columns
          </Typography>
          <Divider />

          <FadeList>
            {Object.entries(config).map(([field, { name, type }]) => (
              <li key={field}>
                <ButtonBase
                  className={classes.buttonBase}
                  onClick={() => setFieldToEdit(field)}
                  aria-label={`Edit column ${field}`}
                  focusRipple
                >
                  <Column
                    label={name}
                    type={type}
                    active={field === fieldToEdit}
                    secondaryItem={
                      field === fieldToEdit && <ChevronRightIcon />
                    }
                  />
                </ButtonBase>
              </li>
            ))}
          </FadeList>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="overline" gutterBottom component="h2">
            Column Type: {config[fieldToEdit].name}
          </Typography>

          <FieldsDropdown
            value={config[fieldToEdit].type}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      {/* <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="overline" gutterBottom component="h2">
            Field Names
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="overline" gutterBottom component="h2">
            Set Column Names
          </Typography>
        </Grid>
      </Grid>

      <Divider />

      <FadeList>
        
      </FadeList> */}
    </>
  );
}
