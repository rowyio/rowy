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
  TextField,
  MenuItem,
  Alert,
  AlertTitle,
  Stack,
  Box,
} from "@mui/material";
import ArrowIcon from "@mui/icons-material/ArrowForward";
import { TableColumn as TableColumnIcon } from "@src/assets/icons";

import { IStepProps } from ".";
import { CsvConfig } from "@src/components/TableModals/ImportCsvWizard";
import FadeList from "@src/components/TableModals/ScrollableList";
import Column, {
  COLUMN_HEADER_HEIGHT,
} from "@src/components/Table/Mock/Column";
import ColumnSelect from "@src/components/Table/ColumnSelect";

import {
  tableScope,
  tableSchemaAtom,
  tableColumnsOrderedAtom,
  ImportCsvData,
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
}: IStepProps & {
  csvData: NonNullable<ImportCsvData & { invalidRows: Record<string, any> }>;
}) {
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

  const handleSelectAll = () => {
    if (selectedFields.length !== csvData.columns.length) {
      setSelectedFields(csvData.columns);
      csvData.columns.forEach((field) => {
        // Try to match each field to a column in the table
        const match =
          find(tableColumns, (column) =>
            column.label.toLowerCase().includes(field.toLowerCase())
          )?.value ?? null;
        const columnKey = camelCase(field);
        const columnConfig: Partial<CsvConfig> = { pairs: [], newColumns: [] };
        columnConfig.pairs = [{ csvKey: field, columnKey: match ?? columnKey }];
        if (!match) {
          columnConfig.newColumns = [
            {
              name: field,
              fieldName: columnKey,
              key: columnKey,
              type: suggestType(csvData.rows, field) || FieldType.shortText,
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
        const columnConfig: Partial<CsvConfig> = { pairs: [], newColumns: [] };
        columnConfig.pairs = [{ csvKey: field, columnKey: match ?? columnKey }];
        if (!match) {
          columnConfig.newColumns = [
            {
              name: field,
              fieldName: columnKey,
              key: columnKey,
              type: suggestType(csvData.rows, field) || FieldType.shortText,
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
    if (columnKey === "") return;
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

  const stepErrors = () => {
    const errors = [];
    if (config.pairs.length < 1) {
      errors.push("You must select at least one column to import!");
    }
    if (config.documentId === "column" && !config.documentIdCsvKey) {
      errors.push("You must select a column for document ID!");
    }
    return errors;
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
        <li>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedFields.length === csvData.columns.length}
                indeterminate={
                  selectedFields.length !== 0 &&
                  selectedFields.length !== csvData.columns.length
                }
                onChange={handleSelectAll}
                color="default"
              />
            }
            label={
              selectedFields.length === csvData.columns.length
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
            <Grid
              container
              key={field}
              component="li"
              wrap="nowrap"
              sx={{
                marginTop: "36px !important",
              }}
            >
              <Grid container item xs alignItems={"center"}>
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

              <Grid item container spacing={4} xs alignItems={"center"}>
                {selected && (
                  <>
                    <Grid item xs>
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
                                        getFieldProp(
                                          "icon",
                                          matchingColumn?.type
                                        )
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
                    </Grid>
                    <Grid item>
                      <TextField
                        label="Field key"
                        value={
                          config.pairs.find(
                            (pair) => pair.columnKey === columnKey
                          )?.columnKey ??
                          config.newColumns.find(
                            (pair) => pair.key === columnKey
                          )?.key
                        }
                        onChange={(e) => {
                          const newKey = e.target.value;
                          const newPairs = config.pairs.map((pair) => {
                            if (pair.columnKey === columnKey) {
                              return { ...pair, columnKey: newKey };
                            } else {
                              return pair;
                            }
                          });

                          const newColumns = config.newColumns.map((column) => {
                            if (column.key === columnKey) {
                              return {
                                ...column,
                                key: newKey,
                                fieldName: newKey,
                              };
                            } else {
                              return column;
                            }
                          });

                          setConfig((config) => ({
                            ...config,
                            pairs: newPairs,
                            newColumns,
                          }));
                        }}
                        sx={{
                          "& .MuiInputLabel-root": {
                            position: "absolute",
                            transform: "translateY(-100%)",
                          },
                          "& .MuiInputBase-root": {
                            height: 40,
                          },
                        }}
                      />
                    </Grid>
                  </>
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
              defaultValue="auto"
              name="radio-buttons-group"
              sx={{ flexDirection: "row" }}
              onChange={(e) => {
                const documentId = e.currentTarget.value as "auto" | "column";
                setConfig((prev: CsvConfig) => ({
                  ...prev,
                  documentId,
                  documentIdCsvKey: null,
                }));
              }}
            >
              <FormControlLabel
                value="auto"
                control={<Radio checked={config.documentId === "auto"} />}
                label="Auto-Generated"
              />
              <FormControlLabel
                value="column"
                control={<Radio checked={config.documentId === "column"} />}
                label="Pick Column"
              />
              <TextField
                disabled={config.documentId !== "column"}
                select
                value={config.documentIdCsvKey ?? ""}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    documentIdCsvKey: e.target.value,
                  }))
                }
                sx={{ width: isXs ? "100%" : 200, margin: "auto" }}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (value) => (
                    <>{value ? value : "Select ID Column"}</>
                  ),
                  MenuProps: {
                    sx: { height: 200 },
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                    transformOrigin: { vertical: "top", horizontal: "right" },
                  },
                }}
                helperText={
                  config.documentId === "column" &&
                  csvData.invalidRows &&
                  `Invalid Rows: ${csvData.invalidRows.length}/${csvData.rows.length}`
                }
              >
                {csvData.columns.map((column) => (
                  <MenuItem key={column} value={column}>
                    {column}
                  </MenuItem>
                ))}
              </TextField>
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          {stepErrors().map((error, index) => (
            <Alert key={index} severity="error" sx={{ my: 1 }}>
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          ))}
        </Grid>
      </Grid>
    </div>
  );
}
