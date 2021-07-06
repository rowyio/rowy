import { useState } from "react";
import MultiSelect from "@antlerengineering/multiselect";
import _find from "lodash/find";
import _findIndex from "lodash/findIndex";
import _camel from "lodash/camelCase";
import _sortBy from "lodash/sortBy";
import clsx from "clsx";

import {
  makeStyles,
  createStyles,
  Grid,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
  Chip,
} from "@material-ui/core";
import ArrowIcon from "@material-ui/icons/ArrowForward";

import { IStepProps } from ".";
import FadeList from "../FadeList";
import Column from "../Column";

import { useFiretableContext } from "contexts/FiretableContext";
import { FieldType } from "constants/fields";
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

      ...theme.typography.subtitle2,
      color: theme.palette.text.secondary,
      transition: theme.transitions.create("color", {
        duration: theme.transitions.duration.short,
      }),
      "&:hover": {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      },

      "&::before": { content: "none" },
      "&::after": { pointerEvents: "none" },
    },
    noneSelected: { color: theme.palette.text.disabled },
    multiSelectInputLabel: {
      padding: theme.spacing(0, 2),
      height: 44 - 2,

      display: "flex",
      alignItems: "center",
    },
    newColumnChip: {
      marginLeft: theme.spacing(1),
      backgroundColor: theme.palette.action.focus,
      ...theme.typography.overline,
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

  const { tableState } = useFiretableContext();
  const tableColumns = _sortBy(Object.values(tableState?.columns ?? {}), [
    "index",
  ]).map((column) => ({ label: column.name, value: column.key }));

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
            ? tableState?.columns[ftColumnKey] ??
              _find(config.newColumns, { key: ftColumnKey }) ??
              null
            : null;
          const isNewColumn = !!_find(config.newColumns, { key: ftColumnKey });

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
                    value={ftColumnKey}
                    onChange={handleChange(field) as any}
                    TextFieldProps={{
                      hiddenLabel: true,
                      SelectProps: {
                        renderValue: (_) => {
                          if (!ftColumnKey) return "Select or add column";
                          else
                            return (
                              <>
                                {matchingColumn?.name}
                                {isNewColumn && (
                                  <Chip
                                    label="New"
                                    size="small"
                                    variant="default"
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
                            !ftColumnKey && classes.noneSelected
                          ),
                          inputHiddenLabel: classes.multiSelectInputLabel,
                        },
                      },
                    }}
                    clearable={false}
                    displayEmpty
                    labelPlural="columns"
                    freeText
                    AddButtonProps={{ children: "Add New Column" }}
                    AddDialogProps={{
                      title: "Add New Column",
                      textFieldLabel: "Column Name",
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
