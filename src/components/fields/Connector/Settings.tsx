import { lazy, Suspense, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";

import {
  Grid,
  Switch,
  TextField,
  FormControl,
  Typography,
  InputLabel,
  Link,
} from "@mui/material";

import FieldSkeleton from "@src/components/SideDrawer/FieldSkeleton";
import CodeEditorHelper from "@src/components/CodeEditor/CodeEditorHelper";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import connectorDefs from "./connector.d.ts?raw";

import { WIKI_LINKS } from "@src/constants/externalLinks";
import { baseFunction } from "./utils";
import { ISettingsProps } from "@src/components/fields/types";
import {
  projectScope,
  projectSettingsAtom,
  rowyRunModalAtom,
} from "@src/atoms/projectScope";

//import typeDefs from "./types.d.ts?raw";
const CodeEditor = lazy(
  () =>
    import("@src/components/CodeEditor" /* webpackChunkName: "CodeEditor" */)
);

// external service requirement
// Web service URL : url
// Results key path :resultsKey
// Primary Key : primaryKey
// Title Key : titleKey

// rowy managed service
// function that takes query & user then returns a list of objects with an array of objects
// Primary Key : primaryKey
// label Key : labelKey
// single select or multiselect
const diagnosticsOptions = {
  noSemanticValidation: false,
  noSyntaxValidation: false,
  noSuggestionDiagnostics: true,
};

export default function Settings({ config, onChange }: ISettingsProps) {
  const [projectSettings] = useAtom(projectSettingsAtom, projectScope);
  const openRowyRunModal = useSetAtom(rowyRunModalAtom, projectScope);
  useEffect(() => {
    if (!projectSettings.rowyRunUrl)
      openRowyRunModal({ feature: "Connector fields" });
  }, [projectSettings.rowyRunUrl]);

  return (
    <>
      <div>
        <Typography variant="subtitle2">Connector Function</Typography>
        <Suspense fallback={<FieldSkeleton height={200} />}>
          <CodeEditor
            minHeight={200}
            value={config.connectorFn ?? baseFunction}
            onChange={onChange("connectorFn")}
            diagnosticsOptions={diagnosticsOptions}
            extraLibs={[connectorDefs]}
          />
        </Suspense>
        <CodeEditorHelper
          docLink={WIKI_LINKS.fieldTypesConnector + "#examples"}
          additionalVariables={[
            {
              key: "row",
              description: `row has the value of doc.data() it has type definitions using this table's schema, but you can access any field in the document.`,
            },
            {
              key: "ref",
              description: `reference object that represents the reference to the current row in firestore db (ie: doc.ref).`,
            },
          ]}
        />
      </div>
      <FormControl>
        <TextField
          id="elementId"
          label="ID"
          placeholder="id"
          name="id"
          value={config.elementId}
          fullWidth
          onChange={(e) => onChange("elementId")(e.target.value)}
          helperText={
            <>
              The key that will be used to uniquely identify the selected
              option.{" "}
              <Link
                href={WIKI_LINKS.fieldTypesConnector + "#api"}
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
                <InlineOpenInNewIcon />
              </Link>
            </>
          }
        />
      </FormControl>
      <FormControl>
        {/* <InputLabel variant="filled">Title Key</InputLabel> */}
        <TextField
          id="labelFormatter"
          label="Label Formatter"
          placeholder="{{id}} - {{name}}"
          name="labelFormatter"
          value={config.labelFormatter}
          fullWidth
          onChange={(e) => onChange("labelFormatter")(e.target.value)}
          helperText={
            <>
              The field key or template that will be used to display the
              selected option.{" "}
              <Link
                href={WIKI_LINKS.fieldTypesConnector + "#api"}
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
                <InlineOpenInNewIcon />
              </Link>
            </>
          }
        />
      </FormControl>
      <FormControl>
        <Grid container>
          <InputLabel variant="filled">
            Allow for multiple item selection
          </InputLabel>
          <Switch
            checked={config.multiple}
            onChange={(e) => onChange("multiple")(e.target.checked)}
          />
        </Grid>
      </FormControl>
      <FormControl>
        {config.multiple && (
          <>
            <TextField
              type="number"
              id="max"
              label="Maximum"
              placeholder="Maximum"
              name="max"
              value={config.max}
              fullWidth
              onChange={(e) => onChange("max")(e.target.value)}
              helperText="The maximum number of items that can be selected, or 0 for no limit."
            />
          </>
        )}
      </FormControl>
    </>
  );
}
