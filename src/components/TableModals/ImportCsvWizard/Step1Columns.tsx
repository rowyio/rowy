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
} from "@mui/material";
import ArrowIcon from "@mui/icons-material/ArrowForward";

import { IStepProps } from ".";
import { CsvConfig } from "@src/components/TableModals/ImportCsvWizard";
import FadeList from "@src/components/TableModals/ScrollableList";
import Column, { COLUMN_HEADER_HEIGHT } from "@src/components/Table/Column";
import MultiSelect from "@rowy/multiselect";

import {
  tableScope,
  tableSchemaAtom,
  tableColumnsOrderedAtom,
  ImportCsvData,
} from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
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
                value={config.documentIdCsvKey}
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
          {stepErrors().map((error) => (
            <Alert severity="error" sx={{ my: 1 }}>
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          ))}
        </Grid>
      </Grid>
    </div>
  );
}
