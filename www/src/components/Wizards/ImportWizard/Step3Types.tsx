import { useState } from "react";

import {
  makeStyles,
  createStyles,
  Grid,
  Typography,
  Divider,
  ButtonBase,
} from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import { IStepProps } from ".";
import FadeList from "../FadeList";
import Column from "../Column";
import Cell from "../Cell";
import FieldsDropdown from "components/Table/ColumnMenu/FieldsDropdown";

import { useFiretableContext } from "contexts/FiretableContext";
import { FieldType } from "constants/fields";
import { SELECTABLE_TYPES } from "./utils";

const useStyles = makeStyles((theme) =>
  createStyles({
    typeSelectRow: { marginBottom: theme.spacing(3) },

    buttonBase: {
      width: "100%",
      textAlign: "left",
    },

    typeHeading: { margin: theme.spacing(5, 0, 1) },

    previewDivider: { marginBottom: theme.spacing(2) },
    previewList: { paddingTop: 0 },
    previewSpacer: { width: theme.spacing(3) },
    cellContainer: { overflow: "hidden" },
  })
);

export default function Step3Types({ config, updateConfig, isXs }: IStepProps) {
  const classes = useStyles();

  const [fieldToEdit, setFieldToEdit] = useState(Object.keys(config)[0]);

  const handleChange = (e) =>
    updateConfig({ [fieldToEdit]: { type: e.target.value } });

  const { tableState } = useFiretableContext();

  return (
    <div>
      <Grid container spacing={2} className={classes.typeSelectRow}>
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
          <Typography
            variant="overline"
            noWrap
            component="h2"
            className={classes.typeHeading}
          >
            Column Type: {config[fieldToEdit].name}
          </Typography>

          <FieldsDropdown
            value={config[fieldToEdit].type}
            onChange={handleChange}
            hideLabel
            options={SELECTABLE_TYPES}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {!isXs && (
          <Grid item xs={12} sm={6}>
            <Typography variant="overline" gutterBottom component="h2">
              Raw Data
            </Typography>
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <Typography variant="overline" gutterBottom component="h2">
            Column Preview
          </Typography>
        </Grid>
      </Grid>

      <Divider className={classes.previewDivider} />

      <Grid container spacing={3}>
        {!isXs && (
          <Grid item xs={12} sm={6}>
            <Column label={fieldToEdit} />
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <Column
            label={config[fieldToEdit].name}
            type={config[fieldToEdit].type}
          />
        </Grid>
      </Grid>

      <FadeList classes={{ list: classes.previewList }}>
        {tableState!.rows!.slice(0, 20).map((row) => (
          <Grid container key={row.id} wrap="nowrap">
            {!isXs && (
              <Grid item xs className={classes.cellContainer}>
                <Cell
                  field={fieldToEdit}
                  value={(JSON.stringify(row[fieldToEdit]) || "")
                    .replace(/^"/, "")
                    .replace(/"$/, "")}
                  type={FieldType.shortText}
                />
              </Grid>
            )}

            {!isXs && <Grid item className={classes.previewSpacer} />}

            <Grid item xs className={classes.cellContainer}>
              <Cell
                field={fieldToEdit}
                value={row[fieldToEdit]}
                type={config[fieldToEdit].type}
                name={config[fieldToEdit].name}
              />
            </Grid>
          </Grid>
        ))}
      </FadeList>
    </div>
  );
}
