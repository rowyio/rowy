import { useState } from "react";
import { useAtom } from "jotai";
import useMemoValue from "use-memo-value";
import { find, findIndex, camelCase, isEqual } from "lodash-es";

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
import FadeList from "@src/components/TableModals/ScrollableList";
import Column, { COLUMN_HEADER_HEIGHT } from "@src/components/Table/Column";
import MultiSelect from "@rowy/multiselect";

import {
  tableScope,
  tableSchemaAtom,
  tableColumnsOrderedAtom,
} from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";

export default function Step1Columns({
  airtableData,
  config,
  updateConfig,
  setConfig,
  isXs,
}: IStepProps) {
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);

  const tableColumns = useMemoValue(
    tableColumnsOrdered
      .filter((column) => column.type !== FieldType.id)
      .map((column) => ({ label: column.name, value: column.fieldName })),
    isEqual
  );

  const [selectedFields, setSelectedFields] = useState(
    config.pairs.map((pair) => pair.fieldKey)
  );

  const handleSelect =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;

      if (checked) {
        setSelectedFields((x) => [...x, field]);

        // Try to match the field to a column in the table
        const match =
          find(tableColumns, (column) =>
            column.label.toLowerCase().includes(field.toLowerCase())
          )?.value ?? null;
        if (match) {
          setConfig((config) => ({
            ...config,
            pairs: [...config.pairs, { fieldKey: field, columnKey: match }],
          }));
        }
      } else {
        const newValue = [...selectedFields];
        newValue.splice(newValue.indexOf(field), 1);
        setSelectedFields(newValue);

        // Check if this pair was already pushed to main config
        const configPair = find(config.pairs, { fieldKey: field });
        const configIndex = findIndex(config.pairs, { fieldKey: field });

        // Delete matching newColumn if it was created
        if (configPair) {
          const newColumnIndex = findIndex(config.newColumns, {
            key: configPair.fieldKey,
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

  const handleChange = (fieldKey: string) => (value: string) => {
    if (!value) return;
    const columnKey = !!tableSchema.columns?.[value] ? value : camelCase(value);
    // Check if this pair already exists in config
    const configIndex = findIndex(config.pairs, { fieldKey });
    if (configIndex > -1) {
      const pairs = [...config.pairs];
      pairs[configIndex].fieldKey = columnKey;
      setConfig((config) => ({ ...config, pairs }));
    } else {
      updateConfig({
        pairs: [{ fieldKey, columnKey }],
      });
    }

    if (!tableSchema.columns?.[value]) {
      updateConfig({
        newColumns: [
          {
            name: value,
            fieldName: columnKey,
            key: columnKey,
            type: FieldType.shortText,
            index: -1,
            config: {},
          },
        ],
      });
    }
  };

  const fieldKeys = Object.keys(airtableData.records[0].fields);
  return (
    <div>
      <Grid container spacing={7}>
        {!isXs && (
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom component="h2">
              Select columns ({config.pairs.length} of {fieldKeys.length})
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
        {fieldKeys.map((field) => {
          const selected = selectedFields.indexOf(field) > -1;
          const columnKey =
            find(config.pairs, { fieldKey: field })?.columnKey ?? null;
          const matchingColumn = columnKey
            ? tableSchema.columns?.[columnKey] ??
              find(config.newColumns, { key: columnKey }) ??
              null
            : null;
          const isNewColumn = !!find(config.newColumns, { key: columnKey });
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
                  label={<Column label={field} />}
                  sx={{
                    marginRight: 0,
                    flex: 1,
                    alignItems: "center",
                    "& .MuiFormControlLabel-label": { mt: 0, flex: 1 },
                  }}
                />
              </Grid>

              <Grid
                item
                sx={{
                  width: (theme) => theme.spacing(7),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ArrowIcon color="disabled" sx={{ color: "secondary.main" }} />
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
                                    sx={{
                                      marginLeft: (theme) =>
                                        theme.spacing(1) + " !important",
                                      backgroundColor: "action.focus",
                                      pointerEvents: "none",
                                    }}
                                  />
                                )}
                              </>
                            );
                        },
                        sx: [
                          {
                            backgroundColor: "background.default",
                            border: (theme) =>
                              `1px solid ${theme.palette.divider}`,
                            borderRadius: 0,
                            boxShadow: "none",
                            "& .MuiSelect-select": {
                              boxSizing: "border-box",
                              height: COLUMN_HEADER_HEIGHT - 2,
                              typography: "caption",
                              fontWeight: "medium",
                              lineHeight: "28px",
                            },

                            color: "text.secondary",
                            "&:hover": {
                              backgroundColor: "background.default",
                              color: "text.primary",
                              boxShadow: "none",
                            },

                            "&::before": { content: "none" },
                            "&::after": { pointerEvents: "none" },
                          },
                          !columnKey && { color: "text.disabled" },
                        ],
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
