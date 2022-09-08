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
  Stack,
  Box,
} from "@mui/material";
import ArrowIcon from "@mui/icons-material/ArrowForward";
import { TableColumn as TableColumnIcon } from "@src/assets/icons";

import { IStepProps } from ".";
import FadeList from "@src/components/TableModals/ScrollableList";
import Column, { COLUMN_HEADER_HEIGHT } from "@src/components/Table/Column";
import ColumnSelect from "@src/components/Table/ColumnSelect";

import {
  tableScope,
  tableSchemaAtom,
  tableColumnsOrderedAtom,
} from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";
import { suggestType } from "@src/components/TableModals/ImportExistingWizard/utils";

export default function Step1Columns({
  csvData,
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
    config.pairs.map((pair) => pair.csvKey)
  );

  // When a field is selected to be imported
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
            pairs: [...config.pairs, { csvKey: field, columnKey: match }],
          }));
        }
        // If no match, create a new column
        else {
          const columnKey = camelCase(field);
          setConfig((config) => ({
            ...config,
            pairs: [...config.pairs, { csvKey: field, columnKey }],
            newColumns: [
              ...config.newColumns,
              {
                name: field,
                fieldName: columnKey,
                key: columnKey,
                type: suggestType(csvData.rows, field) || FieldType.shortText,
                index: -1,
                config: {},
              },
            ],
          }));
        }
      } else {
        const newValue = [...selectedFields];
        newValue.splice(newValue.indexOf(field), 1);
        setSelectedFields(newValue);

        // Check if this pair was already pushed to main config
        const configPair = find(config.pairs, { csvKey: field });
        const configIndex = findIndex(config.pairs, { csvKey: field });

        // Delete matching newColumn if it was created
        if (configPair) {
          const newColumnIndex = findIndex(config.newColumns, {
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

  // When a field is mapped to a new column
  const handleChange = (csvKey: string) => (value: string) => {
    const columnKey = !!tableSchema.columns?.[value] ? value : camelCase(value);

    // Check if this pair already exists in config
    const configIndex = findIndex(config.pairs, { csvKey });
    if (configIndex > -1) {
      const pairs = [...config.pairs];
      pairs[configIndex].columnKey = columnKey;
      setConfig((config) => ({ ...config, pairs }));
    } else {
      updateConfig({
        pairs: [{ csvKey, columnKey }],
      });
    }

    if (!tableSchema.columns?.[value]) {
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
            find(config.pairs, { csvKey: field })?.columnKey ?? null;
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
                  <ColumnSelect
                    multiple={false}
                    value={columnKey}
                    onChange={handleChange(field) as any}
                    TextFieldProps={{
                      hiddenLabel: true,
                      SelectProps: {
                        renderValue: () => {
                          if (!columnKey) return "Select or add column";
                          else
                            return (
                              <Stack
                                direction="row"
                                gap={1}
                                alignItems="center"
                              >
                                <Box sx={{ width: 24, height: 24 }}>
                                  {!isNewColumn ? (
                                    getFieldProp("icon", matchingColumn?.type)
                                  ) : (
                                    <TableColumnIcon color="disabled" />
                                  )}
                                </Box>
                                {matchingColumn?.name}
                                {isNewColumn && (
                                  <Chip
                                    label="New"
                                    color="primary"
                                    size="small"
                                    variant="outlined"
                                    style={{
                                      marginLeft: "auto",
                                      pointerEvents: "none",
                                      height: 24,
                                      fontWeight: "normal",
                                    }}
                                  />
                                )}
                              </Stack>
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
                      sx: { "& .MuiInputLabel-root": { display: "none" } },
                    }}
                    clearable={false}
                    displayEmpty
                    freeText
                    AddButtonProps={{ children: "Create column…" }}
                    AddDialogProps={{
                      title: "Create column",
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
