import { useState } from "react";
import MultiSelect from "@rowy/multiselect";
import _find from "lodash/find";
import _findIndex from "lodash/findIndex";
import _camel from "lodash/camelCase";
import _sortBy from "lodash/sortBy";
import clsx from "clsx";

import { makeStyles, createStyles } from "@mui/styles";
import {
  Grid,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
  Chip,
} from "@mui/material";
import ArrowIcon from "@mui/icons-material/ArrowForward";

import { IStepProps } from ".";
import FadeList from "../ScrollableList";
import Column from "../Column";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { FieldType } from "@src/constants/fields";
import { suggestType } from "../ImportWizard/utils";

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
    activeArrow: { color: theme.palette.secondary.main },

    multiSelectInput: {
      backgroundColor: theme.palette.background.default,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 0,
      boxShadow: "none",
      height: 42,

      "& > *": {
        ...theme.typography.caption,
        fontWeight: theme.typography.fontWeightMedium,
      },

      color: theme.palette.text.secondary,
      "&:hover": {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        boxShadow: "none",
      },

      "&::before": { content: "none" },
      "&::after": { pointerEvents: "none" },
    },
    noneSelected: { color: theme.palette.text.disabled },
    multiSelectInputLabel: {
      display: "flex",
      alignItems: "center",
    },
    newColumnChip: {
      marginLeft: theme.spacing(1) + " !important",
      backgroundColor: theme.palette.action.focus,
      pointerEvents: "none",
    },
  })
);

export default function Step1Columns({
  csvData,
  config,
  updateConfig,
  setConfig,
  isXs,
}: IStepProps) {
  const classes = useStyles();

  const { tableState } = useProjectContext();
  const tableColumns = _sortBy(Object.values(tableState?.columns ?? {}), [
    "index",
  ])
    .filter((column) => column.type !== FieldType.id)
    .map((column) => ({
      label: column.name as string,
      value: column.key as string,
    }));

  const [selectedFields, setSelectedFields] = useState(
    config.pairs.map((pair) => pair.csvKey)
  );

  const handleSelect = (field: string) => (e) => {
    const checked = e.target.checked;

    if (checked) {
      setSelectedFields((x) => [...x, field]);

      // Try to match the field to a column in the table
      const match =
        _find(tableColumns, (column) =>
          column.label.toLowerCase().includes(field.toLowerCase())
        )?.value ?? null;
      if (match) {
        setConfig((config) => ({
          ...config,
          pairs: [...config.pairs, { csvKey: field, columnKey: match }],
        }));
      }
    } else {
      const newValue = [...selectedFields];
      newValue.splice(newValue.indexOf(field), 1);
      setSelectedFields(newValue);

      // Check if this pair was already pushed to main config
      const configPair = _find(config.pairs, { csvKey: field });
      const configIndex = _findIndex(config.pairs, { csvKey: field });

      // Delete matching newColumn if it was created
      if (configPair) {
        const newColumnIndex = _findIndex(config.newColumns, {
          key: configPair.columnKey,
        });
        if (newColumnIndex > -1) {
          const newColumns = [...config.newColumns];
          newColumns.splice(newColumnIndex, 1);
          setConfig((config) => ({ ...config, newColumns }));
        }
      }

      // Delete pair from main config
      if (configIndex > -1) {
        const newConfig = [...config.pairs];
        newConfig.splice(configIndex, 1);
        setConfig((config) => ({ ...config, pairs: newConfig }));
      }
    }
  };

  const handleChange = (csvKey: string) => (value: string) => {
    const columnKey = !!tableState?.columns[value] ? value : _camel(value);

    // Check if this pair already exists in config
    const configIndex = _findIndex(config.pairs, { csvKey });
    if (configIndex > -1) {
      const pairs = [...config.pairs];
      pairs[configIndex].columnKey = columnKey;
      setConfig((config) => ({ ...config, pairs }));
    } else {
      updateConfig({
        pairs: [{ csvKey, columnKey }],
      });
    }

    if (!tableState?.columns[value]) {
      updateConfig({
        newColumns: [
          {
            name: value,
            fieldName: columnKey,
            key: columnKey,
            type: suggestType(csvData.rows, csvKey) || FieldType.shortText,
            index: -1,
            config: {},
          },
        ],
      });
    }
  };

  return (
    <div>
      <Grid container spacing={7}>
        {!isXs && (
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom component="h2">
              Select columns ({config.pairs.length} of {csvData.columns.length})
            </Typography>
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" gutterBottom component="h2">
            Table columns
          </Typography>
        </Grid>
      </Grid>

      <Divider />

      <FadeList>
        {csvData.columns.map((field) => {
          const selected = selectedFields.indexOf(field) > -1;
          const columnKey =
            _find(config.pairs, { csvKey: field })?.columnKey ?? null;
          const matchingColumn = columnKey
            ? tableState?.columns[columnKey] ??
              _find(config.newColumns, { key: columnKey }) ??
              null
            : null;
          const isNewColumn = !!_find(config.newColumns, { key: columnKey });

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
                      color="secondary"
                    />
                  }
                  label={<Column label={field} className={classes.csvColumn} />}
                  classes={{
                    root: classes.formControlLabel,
                    label: classes.columnLabel,
                  }}
                  sx={{
                    alignItems: "center",
                    "& .MuiFormControlLabel-label": { mt: 0 },
                  }}
                />
              </Grid>

              <Grid item className={classes.arrowGridItem}>
                <ArrowIcon
                  color="disabled"
                  className={selected ? classes.activeArrow : ""}
                />
              </Grid>

              <Grid item xs>
                {selected && (
                  <MultiSelect
                    multiple={false}
                    options={tableColumns}
                    value={columnKey}
                    onChange={handleChange(field) as any}
                    TextFieldProps={{
                      hiddenLabel: true,
                      SelectProps: {
                        renderValue: () => {
                          if (!columnKey) return "Select or add column";
                          else
                            return (
                              <>
                                {matchingColumn?.name}
                                {isNewColumn && (
                                  <Chip
                                    label="New"
                                    size="small"
                                    className={classes.newColumnChip}
                                  />
                                )}
                              </>
                            );
                        },
                      },
                      InputProps: {
                        classes: {
                          root: clsx(
                            classes.multiSelectInput,
                            !columnKey && classes.noneSelected
                          ),
                          inputHiddenLabel: classes.multiSelectInputLabel,
                        },
                      },
                    }}
                    clearable={false}
                    displayEmpty
                    labelPlural="columns"
                    freeText
                    AddButtonProps={{ children: "Add new column…" }}
                    AddDialogProps={{
                      title: "Add new column",
                      textFieldLabel: "Column name",
                    }}
                  />
                )}
              </Grid>
            </Grid>
          );
        })}
      </FadeList>
    </div>
  );
}
