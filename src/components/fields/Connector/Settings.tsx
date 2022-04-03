import { lazy, Suspense, useState } from "react";
import _get from "lodash/get";
import stringify from "json-stable-stringify-without-jsonify";

import {
  Stepper,
  Step,
  StepButton,
  StepContent,
  Stack,
  Grid,
  Switch,
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  InputLabel,
  Link,
  Checkbox,
  FormHelperText,
  Fab,
} from "@mui/material";

import SteppedAccordion from "@src/components/SteppedAccordion";
import FieldSkeleton from "@src/components/SideDrawer/Form/FieldSkeleton";
import CodeEditorHelper from "@src/components/CodeEditor/CodeEditorHelper";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
/* eslint-disable import/no-webpack-loader-syntax */
import connectorDefs from "!!raw-loader!./connector.d.ts";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { WIKI_LINKS } from "@src/constants/externalLinks";
import { useAppContext } from "@src/contexts/AppContext";
import { baseFunction } from "./utils";

//import typeDefs from "!!raw-loader!./types.d.ts";
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

export default function Settings({ config, onChange }) {
  const { projectId } = useAppContext();
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
          additionalVariables={[]}
        />
      </div>
      <FormControl>
        {/* <InputLabel variant="filled">Primary Key</InputLabel> */}
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
