import { useState } from "react";
import { find } from "lodash-es";
import { parseJSON } from "date-fns";

import { Grid, Typography, Divider, ButtonBase } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { IStepProps } from ".";
import ScrollableList from "@src/components/TableModals/ScrollableList";
import Column from "@src/components/Table/Mock/Column";
import Cell from "@src/components/Table/Mock/Cell";
import FieldsDropdown from "@src/components/ColumnModals/FieldsDropdown";

import { FieldType } from "@src/constants/fields";
import { SELECTABLE_TYPES } from "@src/components/TableModals/ImportExistingWizard/utils";

export default function Step2NewColumns({
  csvData,
  config,
  setConfig,
  isXs,
}: IStepProps) {
  const [fieldToEdit, setFieldToEdit] = useState(0);

  const handleChange = (v: FieldType) => {
    const newColumns = [...config.newColumns];
    newColumns[fieldToEdit].type = v;

    setConfig((config) => ({ ...config, newColumns }));
  };

  const currentPair = find(config.pairs, {
    columnKey: config.newColumns[fieldToEdit]?.key,
  });
  const rowData = csvData.rows.map((row) => row[currentPair?.csvKey ?? ""]);

  return (
    <>
      <div>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom component="h2">
              New table columns
            </Typography>
            <Divider />

            <ScrollableList>
              {config.newColumns.map(({ key, name, type }, i) => (
                <li key={key}>
                  <ButtonBase
                    sx={{ width: "100%", textAlign: "left" }}
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
            </ScrollableList>
          </Grid>
          <Grid item xs={12} sm={6} style={{ paddingTop: 68 }}>
            <FieldsDropdown
              label={`Column type: ${config.newColumns[fieldToEdit].name}`}
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

        <ScrollableList listSx={{ pt: 0 }}>
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
                <Grid item xs style={{ overflow: "hidden" }}>
                  <Cell
                    field={config.newColumns[fieldToEdit].key}
                    value={(JSON.stringify(cell) || "")
                      .replace(/^"/, "")
                      .replace(/"$/, "")}
                    type={FieldType.shortText}
                  />
                </Grid>
              )}

              {!isXs && (
                <Grid item sx={{ width: (theme) => theme.spacing(3) }} />
              )}

              <Grid item xs style={{ overflow: "hidden" }}>
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
        </ScrollableList>
      </div>
    </>
  );
}
