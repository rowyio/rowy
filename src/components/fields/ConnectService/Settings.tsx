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
import MultiSelect from "@rowy/multiselect";
import FieldSkeleton from "@src/components/SideDrawer/Form/FieldSkeleton";
import CodeEditorHelper from "@src/components/CodeEditor/CodeEditorHelper";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

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

const diagnosticsOptions = {
  noSemanticValidation: false,
  noSyntaxValidation: false,
  noSuggestionDiagnostics: true,
};

export default function Settings({ config, onChange }) {
  const { projectId } = useAppContext();
  return (
    <SteppedAccordion
      steps={[
        {
          id: "mode",
          title: "Mode",
          content: (
            <Stack spacing={3}>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  Select the service mode:
                </FormLabel>
                <RadioGroup
                  aria-label="Service Mode"
                  name="mode"
                  value={config.mode}
                  onChange={(e) => onChange("mode")(e.target.value)}
                >
                  <FormControlLabel
                    value="managed"
                    control={<Radio />}
                    label={
                      <>
                        <Typography variant="inherit">Managed</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Write JavaScript code below that will be executed by
                          Rowy Run to return list of options displayed in the
                          dropdown{" "}
                          <Link
                            href={WIKI_LINKS.rowyRun}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Requires Rowy Run setup
                            <InlineOpenInNewIcon />
                          </Link>
                        </Typography>
                      </>
                    }
                  />
                  <FormControlLabel
                    value="external"
                    control={<Radio />}
                    label={
                      <>
                        <Typography variant="inherit">External</Typography>
                        <Typography variant="caption" color="textSecondary">
                          An existing api endpoint or your own web service, that
                          will be called when the dropdown is opened.
                          <Link
                            href={WIKI_LINKS.fieldTypesConnectService}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Learn more
                            <InlineOpenInNewIcon />
                          </Link>
                        </Typography>
                      </>
                    }
                  />
                </RadioGroup>
              </FormControl>

              {config.mode === "external" ? (
                <TextField
                  id="url"
                  label="External Service URL"
                  name="url"
                  value={config.url}
                  fullWidth
                  onChange={(e) => onChange("url")(e.target.value)}
                  helperText={
                    <>
                      Add the url of the endpoint. If you have deployed it to
                      Cloud Run you can find it{" "}
                      <Link
                        href={`https://console.firebase.google.com/project/${projectId}/run/list`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        here
                        <InlineOpenInNewIcon />
                      </Link>
                      <br />
                      Your endpoint must be compatible with Rowy Connect service
                      columns.{" "}
                      <Link
                        href={WIKI_LINKS.fieldTypesConnectService + "#api"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View requirements
                        <InlineOpenInNewIcon />
                      </Link>
                    </>
                  }
                />
              ) : (
                <>
                  <FormControl>
                    <InputLabel variant="filled">Service Function</InputLabel>
                    <Suspense fallback={<FieldSkeleton height={300} />}>
                      <CodeEditor
                        minHeight={200}
                        value={config.serviceFn ?? baseFunction}
                        onChange={onChange("serviceFn")}
                        diagnosticsOptions={diagnosticsOptions}
                        extraLibs={[
                          `type ConnectService = (request: {query:string, row:any, user:any}) => Promise<any[]>;`,
                        ]}
                      />
                    </Suspense>
                    <CodeEditorHelper
                      docLink={WIKI_LINKS.fieldTypesAction + "#script"}
                      additionalVariables={[]}
                    />
                  </FormControl>
                </>
              )}
            </Stack>
          ),
        },
        {
          id: "Interface",
          title: "Interface",
          content: (
            <Stack spacing={3}>
              <FormControl>
                {/* <InputLabel variant="filled">Primary Key</InputLabel> */}
                <TextField
                  id="primaryKey"
                  label="Primary Key"
                  placeholder="Primary Key"
                  name="primaryKey"
                  value={config.primaryKey}
                  fullWidth
                  onChange={(e) => onChange("primaryKey")(e.target.value)}
                  helperText={
                    <>
                      The key that will be used to uniquely identify the
                      selected option.{" "}
                      <Link
                        href={
                          WIKI_LINKS.fieldTypesConnectService + "#primaryKey"
                        }
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
                  id="titleKey"
                  label="Title Key"
                  placeholder="Title Key"
                  name="titleKey"
                  value={config.titleKey}
                  fullWidth
                  onChange={(e) => onChange("titleKey")(e.target.value)}
                  helperText={
                    <>
                      The key that will be used to display the selected option.{" "}
                      <Link
                        href={WIKI_LINKS.fieldTypesConnectService + "#titleKey"}
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
              {config.mode === "external" && (
                <FormControl>
                  {/* <InputLabel variant="filled">Results Key</InputLabel> */}
                  <TextField
                    id="resultsKey"
                    label="Results Key"
                    placeholder="Results Key"
                    name="resultsKey"
                    value={config.resultsKey}
                    fullWidth
                    onChange={(e) => onChange("resultsKey")(e.target.value)}
                    helperText={
                      <>
                        (Optional)The key that will be used to retrieve the list
                        of results, if the service doesn't not return an array
                        options directly{" "}
                        <Link
                          href={
                            WIKI_LINKS.fieldTypesConnectService + "#resultsKey"
                          }
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
              )}
            </Stack>
          ),
        },

        {
          id: "optionsSettings",
          title: "Options Settings",
          content: (
            <Stack spacing={3}>
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
            </Stack>
          ),
        },
      ]}
    />
  );
}

/*
<>
      <TextField
        label="Web service URL"
        name="url"
        value={config.url}
        fullWidth
        onChange={(e) => {
          onChange("url")(e.target.value);
        }}
      />
      <TextField
        label="Results key path"
        name="resultsKey"
        helperText="Can be specified as a key path"
        placeholder="data.results"
        value={config.resultsKey}
        fullWidth
        onChange={(e) => {
          onChange("resultsKey")(e.target.value);
        }}
      />
      <TextField
        label="Primary key"
        name="primaryKey"
        value={config.primaryKey}
        fullWidth
        onChange={(e) => {
          onChange("primaryKey")(e.target.value);
        }}
      />
      <Grid container direction="row" spacing={1}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Title key (optional)"
            name="titleKey"
            value={config.titleKey}
            fullWidth
            onChange={(e) => {
              onChange("titleKey")(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Subtitle key (optional)"
            name="subtitleKey"
            value={config.subtitleKey}
            fullWidth
            onChange={(e) => {
              onChange("subtitleKey")(e.target.value);
            }}
          />{" "}
        </Grid>{" "}
      </Grid>
      <FormControlLabel
        control={
          <Switch
            checked={config.multiple}
            onChange={() => onChange("multiple")(!Boolean(config.multiple))}
            name="select-multiple"
          />
        }
        label="Enable multiple item selection"
        sx={{
          alignItems: "center",
          "& .MuiFormControlLabel-label": { mt: 0 },
        }}
      />
    </>
*/
