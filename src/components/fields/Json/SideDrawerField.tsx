import { useState } from "react";
import { Controller } from "react-hook-form";
import createPersistedState from "use-persisted-state";
import stringify from "json-stable-stringify-without-jsonify";
import { ISideDrawerFieldProps } from "../types";

import ReactJson from "react-json-view";
import CodeEditor from "@src/components/CodeEditor";

import { useTheme, Tab, FormHelperText } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useFieldStyles } from "@src/components/SideDrawer/Form/utils";

const useJsonEditor = createPersistedState("__ROWY__JSON_EDITOR");

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
  const fieldClasses = useFieldStyles();
  const theme = useTheme();

  const [editor, setEditor] = useJsonEditor<"tree" | "code">("tree");
  const [codeValid, setCodeValid] = useState(true);

  const changeEditor = (_, newValue) => {
    setEditor(newValue);
    setCodeValid(true);
  };

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
            <div
              className={fieldClasses.root}
              style={{
                whiteSpace: "pre-wrap",
                ...(theme.typography.caption as any),
                fontFamily: theme.typography.fontFamilyMono,
                wordBreak: "break-word",
              }}
            >
              {value && formattedJson}
            </div>
          );

        const handleEdit = (edit) => {
          onChange(edit.updated_src);
        };

        return (
          <TabContext value={editor}>
            <TabList
              onChange={changeEditor}
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
              <div
                className={fieldClasses.root}
                style={{
                  overflowX: "auto",
                  ...(theme.typography.caption as any),
                }}
              >
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
              </div>
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
