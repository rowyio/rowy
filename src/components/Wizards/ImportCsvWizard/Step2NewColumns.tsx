import { useState } from "react";
import _find from "lodash/find";
import { parseJSON } from "date-fns";

import { makeStyles, createStyles } from "@mui/styles";
import { Grid, Typography, Divider, ButtonBase } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { IStepProps } from ".";
import FadeList from "../ScrollableList";
import Column from "../Column";
import Cell from "../Cell";
import FieldsDropdown from "@src/components/Table/ColumnMenu/FieldsDropdown";

import { FieldType } from "@src/constants/fields";
import { SELECTABLE_TYPES } from "../ImportWizard/utils";

const useStyles = makeStyles((theme) =>
  createStyles({
    typeSelectRow: { marginBottom: theme.spacing(3) },

    buttonBase: {
      width: "100%",
      textAlign: "left",
    },

    typeHeading: { margin: theme.spacing(52 / 8, 0, 1) },

    previewDivider: { marginBottom: theme.spacing(2) },
    previewSpacer: { width: theme.spacing(3) },
    cellContainer: { overflow: "hidden" },
  })
);

export default function Step2NewColumns({
  csvData,
  config,
  setConfig,
  isXs,
}: IStepProps) {
  const classes = useStyles();

  const [fieldToEdit, setFieldToEdit] = useState(0);

  const handleChange = (v) => {
    const newColumns = [...config.newColumns];
    newColumns[fieldToEdit].type = v;

    setConfig((config) => ({ ...config, newColumns }));
  };

  const currentPair = _find(config.pairs, {
    columnKey: config.newColumns[fieldToEdit]?.key,
  });
  const rowData = csvData.rows.map((row) => row[currentPair?.csvKey ?? ""]);

  return (
    <>
      <div>
        <Grid container spacing={2} className={classes.typeSelectRow}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom component="h2">
              New table columns
            </Typography>
            <Divider />

            <FadeList>
              {config.newColumns.map(({ key, name, type }, i) => (
                <li key={key}>
                  <ButtonBase
                    className={classes.buttonBase}
                    onClick={() => setFieldToEdit(i)}
                    aria-label={`Edit column ${key}`}
                    focusRipple
                  >
                    <Column
                      label={name}
                      type={type}
                      active={i === fieldToEdit}
                      secondaryItem={i === fieldToEdit && <ChevronRightIcon />}
                    />
                  </ButtonBase>
                </li>
              ))}
            </FadeList>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              noWrap
              component="h2"
              className={classes.typeHeading}
            >
              Column type: {config.newColumns[fieldToEdit].name}
            </Typography>

            <FieldsDropdown
              value={config.newColumns[fieldToEdit].type}
              onChange={handleChange}
              hideLabel
              options={SELECTABLE_TYPES}
            />
          </Grid>
        </Grid>
      </div>

      <div>
        <Grid container spacing={3}>
          {!isXs && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom component="h2">
                Raw data
              </Typography>
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom component="h2">
              Column preview
            </Typography>
          </Grid>
        </Grid>

        <FadeList listSx={{ pt: 0 }}>
          <Grid
            container
            spacing={3}
            style={{ position: "sticky", top: 0, zIndex: 1, marginTop: 0 }}
          >
            {!isXs && (
              <Grid item xs={12} sm={6} style={{ paddingTop: 0 }}>
                <Column label={config.newColumns[fieldToEdit].key} />
              </Grid>
            )}
            <Grid item xs={12} sm={6} style={{ paddingTop: 0 }}>
              <Column
                label={config.newColumns[fieldToEdit].name}
                type={config.newColumns[fieldToEdit].type}
              />
            </Grid>
          </Grid>

          {rowData.slice(0, 20).map((cell, i) => (
            <Grid container key={i} wrap="nowrap">
              {!isXs && (
                <Grid item xs className={classes.cellContainer}>
                  <Cell
                    field={config.newColumns[fieldToEdit].key}
                    value={(JSON.stringify(cell) || "")
                      .replace(/^"/, "")
                      .replace(/"$/, "")}
                    type={FieldType.shortText}
                  />
                </Grid>
              )}

              {!isXs && <Grid item className={classes.previewSpacer} />}

              <Grid item xs className={classes.cellContainer}>
                <Cell
                  field={config.newColumns[fieldToEdit].key}
                  value={
                    config.newColumns[fieldToEdit].type === FieldType.date ||
                    config.newColumns[fieldToEdit].type === FieldType.dateTime
                      ? parseJSON(cell).getTime()
                      : cell
                  }
                  type={config.newColumns[fieldToEdit].type}
                  name={config.newColumns[fieldToEdit].name}
                />
              </Grid>
            </Grid>
          ))}
        </FadeList>
      </div>
    </>
  );
}
