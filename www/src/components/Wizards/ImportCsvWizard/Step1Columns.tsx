import React, { useState, useEffect } from "react";
import MultiSelect from "@antlerengineering/multiselect";
import _find from "lodash/find";

import {
  makeStyles,
  createStyles,
  Grid,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import ArrowIcon from "@material-ui/icons/ArrowForward";

import { IStepProps } from ".";
import FadeList from "../FadeList";
import Column from "../Column";
import EmptyState from "components/EmptyState";
import AddColumnIcon from "assets/icons/AddColumn";

import { useFiretableContext } from "contexts/firetableContext";

const useStyles = makeStyles((theme) =>
  createStyles({
    csvListItem: { display: "flex" },
    csvColumn: {},

    formControlLabel: {
      marginRight: 0,
      flex: 1,
    },
    columnLabel: { flex: 1 },

    arrowGridItem: {
      width: theme.spacing(7),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  })
);

export default function Step1Columns({
  csvData,
  config,
  updateConfig,
  isXs,
}: IStepProps) {
  const classes = useStyles();

  const { tableState } = useFiretableContext();
  const tableColumns = Object.values(
    tableState?.columns ?? {}
  ).map((column) => ({ label: column.name, value: column.key }));

  const [selectedFields, setSelectedFields] = useState(
    config.pairs.map((pair) => pair.csvKey)
  );

  const handleSelect = (field: string) => (_, checked: boolean) => {
    if (checked) {
      setSelectedFields((x) => [...x, field]);
    } else {
      const newValue = [...selectedFields];
      newValue.splice(newValue.indexOf(field), 1);
      setSelectedFields(newValue);
    }
  };

  const handleChange = (csvKey: string) => (columnKey: string) =>
    updateConfig({ pairs: [{ csvKey, columnKey }] });

  return (
    <>
      <Grid container spacing={7}>
        {!isXs && (
          <Grid item xs={12} sm={6}>
            <Typography variant="overline" gutterBottom component="h2">
              Select Columns ({config.pairs.length} of {csvData.columns.length})
            </Typography>
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <Typography variant="overline" gutterBottom component="h2">
            Firetable Columns
          </Typography>
        </Grid>
      </Grid>

      <Divider />

      <FadeList>
        {csvData.columns.map((field) => {
          const selected = selectedFields.indexOf(field) > -1;
          const ftColumnKey =
            _find(config.pairs, { csvKey: field })?.columnKey ?? null;
          const matchingColumn = ftColumnKey
            ? tableState?.columns[ftColumnKey]
            : null;

          return (
            <Grid container key={field} component="li" wrap="nowrap">
              <Grid item xs>
                <FormControlLabel
                  key={field}
                  control={
                    <Checkbox
                      checked={selected}
                      aria-label={`Select column ${field}`}
                      onChange={handleSelect(field)}
                      color="default"
                    />
                  }
                  label={<Column label={field} className={classes.csvColumn} />}
                  classes={{
                    root: classes.formControlLabel,
                    label: classes.columnLabel,
                  }}
                />
              </Grid>

              <Grid item className={classes.arrowGridItem}>
                <ArrowIcon color={selected ? "action" : "disabled"} />
              </Grid>

              <Grid item xs>
                {selected && (
                  <MultiSelect
                    multiple={false}
                    options={tableColumns}
                    value={ftColumnKey}
                    onChange={handleChange(field) as any}
                    TextFieldProps={{
                      hiddenLabel: true,
                      SelectProps: {
                        renderValue: (_) => {
                          if (!ftColumnKey) return "Select or add column";
                          else return matchingColumn.name;
                        },
                      },
                    }}
                    clearable={false}
                    displayEmpty
                  />
                )}
              </Grid>
            </Grid>
          );
        })}
      </FadeList>
    </>
  );
}
