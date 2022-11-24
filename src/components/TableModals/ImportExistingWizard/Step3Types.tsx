import { useState } from "react";
import { useAtom } from "jotai";

import { Grid, Typography, Divider, ButtonBase } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { IStepProps } from ".";
import ScrollableList from "@src/components/TableModals/ScrollableList";
import Column from "@src/components/Table/Mock/Column";
import Cell from "@src/components/Table/Mock/Cell";
import FieldsDropdown from "@src/components/ColumnModals/FieldsDropdown";

import { tableScope, tableRowsAtom } from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
import { SELECTABLE_TYPES } from "./utils";

export default function Step3Types({ config, updateConfig, isXs }: IStepProps) {
  const [tableRows] = useAtom(tableRowsAtom, tableScope);

  const [fieldToEdit, setFieldToEdit] = useState(Object.keys(config)[0]);
  const handleChange = (v: FieldType) =>
    updateConfig({ [fieldToEdit]: { type: v } });

  return (
    <div>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" gutterBottom component="h2">
            Table columns
          </Typography>
          <Divider />

          <ScrollableList>
            {Object.entries(config).map(([field, { name, type }]) => (
              <li key={field}>
                <ButtonBase
                  onClick={() => setFieldToEdit(field)}
                  aria-label={`Edit column ${field}`}
                  focusRipple
                  sx={{ width: "100%", textAlign: "left" }}
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
          </ScrollableList>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle2"
            noWrap
            component="h2"
            sx={{ mt: 52 / 8, mx: 0, mb: 1 }}
          >
            Column type: {config[fieldToEdit].name}
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
              <Column label={fieldToEdit} />
            </Grid>
          )}
          <Grid item xs={12} sm={6} style={{ paddingTop: 0 }}>
            <Column
              label={config[fieldToEdit].name}
              type={config[fieldToEdit].type}
            />
          </Grid>
        </Grid>

        {tableRows.slice(0, 20).map((row) => (
          <Grid container key={row.id} wrap="nowrap">
            {!isXs && (
              <Grid item xs style={{ overflow: "hidden" }}>
                <Cell
                  field={fieldToEdit}
                  value={(JSON.stringify(row[fieldToEdit]) || "")
                    .replace(/^"/, "")
                    .replace(/"$/, "")}
                  type={FieldType.shortText}
                />
              </Grid>
            )}

            {!isXs && <Grid item sx={{ width: (theme) => theme.spacing(3) }} />}

            <Grid item xs style={{ overflow: "hidden" }}>
              <Cell
                field={fieldToEdit}
                value={row[fieldToEdit]}
                type={config[fieldToEdit].type}
                name={config[fieldToEdit].name}
              />
            </Grid>
          </Grid>
        ))}
      </ScrollableList>
    </div>
  );
}
