import { useState } from "react";
import { Controller } from "react-hook-form";
import { useAtom } from "jotai";
import stringify from "json-stable-stringify-without-jsonify";
import { ISideDrawerFieldProps } from "@src/components/fields/types";

import ReactJson, { InteractionProps } from "react-json-view";
import CodeEditor from "@src/components/CodeEditor";

import { useTheme, Box, Tab, FormHelperText } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { fieldSx } from "@src/components/SideDrawer/utils";
import { globalScope, jsonEditorAtom } from "@src/atoms/globalScope";

const isValidJson = (val: any) => {
  try {
    if (typeof val === "string") JSON.parse(val);
    else JSON.stringify(val);
  } catch (error) {
    return false;
  }
  return true;
};

export default function Json({
  control,
  column,
  disabled,
}: ISideDrawerFieldProps) {
  const theme = useTheme();

  const [editor, setEditor] = useAtom(jsonEditorAtom, globalScope);
  const [codeValid, setCodeValid] = useState(true);

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ field: { onChange, value } }) => {
        const sanitizedValue =
          value !== undefined && isValidJson(value)
            ? value
            : column.config?.isArray
            ? []
            : {};
        const formattedJson = stringify(sanitizedValue, { space: 2 });

        if (disabled)
          return (
            <Box
              sx={[
                fieldSx,
                {
                  whiteSpace: "pre-wrap",
                  typography: "caption",
                  fontFamily: theme.typography.fontFamilyMono,
                  wordBreak: "break-word",
                },
              ]}
            >
              {value && formattedJson}
            </Box>
          );

        const handleEdit = (edit: InteractionProps) => {
          onChange(edit.updated_src);
        };

        return (
          <TabContext value={editor}>
            <TabList
              onChange={(_, newValue) => {
                setEditor(newValue);
                setCodeValid(true);
              }}
              aria-label="JSON editor"
              variant="standard"
              sx={{
                minHeight: 32,
                mt: -32 / 8,

                "& .MuiTabs-flexContainer": { justifyContent: "flex-end" },
                "& .MuiTab-root": { minHeight: 32, py: 0 },
              }}
            >
              <Tab label="Tree" value="tree" />
              <Tab label="Code" value="code" />
            </TabList>

            <TabPanel value="tree" sx={{ p: 0 }}>
              <Box sx={[fieldSx, { overflowX: "auto", typography: "caption" }]}>
                <ReactJson
                  src={sanitizedValue}
                  onEdit={handleEdit}
                  onAdd={handleEdit}
                  onDelete={handleEdit}
                  theme={
                    theme.palette.mode === "dark" ? "monokai" : "rjv-default"
                  }
                  iconStyle="triangle"
                  style={{
                    fontFamily: theme.typography.fontFamilyMono,
                    backgroundColor: "transparent",
                    minHeight: 100 - 4 - 4,
                  }}
                  quotesOnKeys={false}
                />
              </Box>
            </TabPanel>

            <TabPanel value="code" sx={{ p: 0 }}>
              <CodeEditor
                defaultLanguage="json"
                value={formattedJson || "{\n  \n}"}
                onChange={(v) => {
                  try {
                    if (v) onChange(JSON.parse(v));
                  } catch (e) {
                    console.log(`Failed to parse JSON: ${e}`);
                    setCodeValid(false);
                  }
                }}
                onValidStatusUpdate={({ isValid }) => setCodeValid(isValid)}
                error={!codeValid}
              />
              {!codeValid && (
                <FormHelperText error variant="filled">
                  Invalid JSON
                </FormHelperText>
              )}
            </TabPanel>
          </TabContext>
        );
      }}
    />
  );
}
