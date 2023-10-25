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
  FormControl,
  RadioGroup,
  Radio,
  Stack,
  Box,
} from "@mui/material";
import ArrowIcon from "@mui/icons-material/ArrowForward";
import { TableColumn as TableColumnIcon } from "@src/assets/icons";

import { IStepProps } from ".";
import { AirtableConfig } from "@src/components/TableModals/ImportAirtableWizard";
import FadeList from "@src/components/TableModals/ScrollableList";
import Column, {
  COLUMN_HEADER_HEIGHT,
} from "@src/components/Table/Mock/Column";
import ColumnSelect from "@src/components/Table/ColumnSelect";

import {
  tableScope,
  tableSchemaAtom,
  tableColumnsOrderedAtom,
} from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";
import { suggestType } from "@src/components/TableModals/ImportAirtableWizard/utils";

function getFieldKeys(records: any[]) {
  let fieldKeys = new Set<string>();
  for (let i = 0; i < records.length; i++) {
    const keys = Object.keys(records[i].fields);
    for (let j = 0; j < keys.length; j++) {
      fieldKeys.add(keys[j]);
    }
  }
  return [...fieldKeys];
}

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

  const fieldKeys = getFieldKeys(airtableData.records);
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

        const columnKey = camelCase(field);
        const columnConfig: Partial<AirtableConfig> = {
          pairs: [],
          newColumns: [],
        };
        columnConfig.pairs = [
          { fieldKey: field, columnKey: match ?? columnKey },
        ];
        if (!match) {
          columnConfig.newColumns = [
            {
              name: field,
              fieldName: columnKey,
              key: columnKey,
              type:
                suggestType(airtableData.records, field) || FieldType.shortText,
              index: -1,
              config: {},
            },
          ];
        }
        updateConfig(columnConfig);
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

  const handleSelectAll = () => {
    if (selectedFields.length !== fieldKeys.length) {
      setSelectedFields(fieldKeys);
      fieldKeys.forEach((field) => {
        // Try to match each field to a column in the table
        const match =
          find(tableColumns, (column) =>
            column.label.toLowerCase().includes(field.toLowerCase())
          )?.value ?? null;

        const columnKey = camelCase(field);
        const columnConfig: Partial<AirtableConfig> = {
          pairs: [],
          newColumns: [],
        };
        columnConfig.pairs = [
          { fieldKey: field, columnKey: match ?? columnKey },
        ];
        if (!match) {
          columnConfig.newColumns = [
            {
              name: field,
              fieldName: columnKey,
              key: columnKey,
              type:
                suggestType(airtableData.records, field) || FieldType.shortText,
              index: -1,
              config: {},
            },
          ];
        }
        updateConfig(columnConfig);
      });
    } else {
      setSelectedFields([]);
      setConfig((config) => ({ ...config, newColumns: [], pairs: [] }));
    }
  };

  // When a field is mapped to a new column
  const handleChange = (fieldKey: string) => (value: string) => {
    if (!value) return;
    const columnKey = !!tableSchema.columns?.[value] ? value : camelCase(value);
    if (columnKey === "") return;
    // Check if this pair already exists in config
    const configIndex = findIndex(config.pairs, { fieldKey });
    console.log(columnKey, configIndex);
    if (configIndex > -1) {
      const pairs = [...config.pairs];
      pairs[configIndex].columnKey = columnKey;
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
            type:
              suggestType(airtableData.records, fieldKey) ||
              FieldType.shortText,
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
        <li>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedFields.length === fieldKeys.length}
                indeterminate={
                  selectedFields.length !== 0 &&
                  selectedFields.length !== fieldKeys.length
                }
                onChange={handleSelectAll}
                color="default"
              />
            }
            label={
              selectedFields.length === fieldKeys.length
                ? "Clear all"
                : "Select all"
            }
            sx={{
              height: 42,
              mr: 0,
              alignItems: "center",
              "& .MuiFormControlLabel-label": { mt: 0, flex: 1 },
            }}
          />
        </li>
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
      <Grid container marginTop={2}>
        <Typography variant="subtitle2" gutterBottom component="h2">
          Document Ids (Optional)
        </Typography>
        <Divider />
        <Grid item xs={12}>
          <FormControl>
            <RadioGroup
              defaultValue="recordId"
              name="radio-buttons-group"
              sx={{ flexDirection: "row" }}
              onChange={(e) => {
                const documentId = e.currentTarget.value as "auto" | "recordId";
                setConfig((prev: AirtableConfig) => ({ ...prev, documentId }));
              }}
            >
              <FormControlLabel
                value="recordId"
                control={<Radio />}
                label="Use Airtable Record ID"
              />
              <FormControlLabel
                value="auto"
                control={<Radio />}
                label="Auto-Generated"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
}
