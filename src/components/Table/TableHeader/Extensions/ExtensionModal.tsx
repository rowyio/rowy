import { useState } from "react";
import _isEqual from "lodash/isEqual";
import useStateRef from "react-usestateref";

import {
  styled,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  Switch,
  Stack,
  Tab,
  TextField,
  Typography,
} from "@material-ui/core";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import AddIcon from "@material-ui/icons/AddBox";
import DeleteIcon from "@material-ui/icons/RemoveCircle";

import Modal, { IModalProps } from "components/Modal";
import CodeEditor from "../../editors/CodeEditor";
import CodeEditorHelper from "components/CodeEditorHelper";

import { useConfirmation } from "components/ConfirmationDialog";
import { useRowyContext } from "contexts/RowyContext";

import { IExtension, triggerTypes } from "./utils";
import WIKI_LINKS from "constants/wikiLinks";

const additionalVariables = [
  {
    key: "change",
    description:
      "you can pass in field name to change.before.get() or change.after.get() to get changes",
  },
  {
    key: "triggerType",
    description: "triggerType indicates the type of the extension invocation",
  },
  {
    key: "fieldTypes",
    description:
      "fieldTypes is a map of all fields and its corresponding Rowy column type",
  },
  {
    key: "extensionConfig",
    description: "the configuration object of this extension",
  },
];

const StyledTabPanel = styled(TabPanel)({
  flexGrow: 1,

  overflowY: "auto",
  margin: "0 calc(var(--dialog-spacing) * -1) 0 !important",
  padding: "var(--dialog-spacing) var(--dialog-spacing) 0",

  "&[hidden]": { display: "none" },

  display: "flex",
  flexDirection: "column",
});

export interface IExtensionModalProps {
  handleClose: IModalProps["onClose"];
  handleAdd: (extensionObject: IExtension) => void;
  handleUpdate: (extensionObject: IExtension) => void;
  mode: "add" | "update";
  extensionObject: IExtension;
}

export default function ExtensionModal({
  handleClose,
  handleAdd,
  handleUpdate,
  mode,
  extensionObject: initialObject,
}: IExtensionModalProps) {
  const { requestConfirmation } = useConfirmation();
  const [extensionObject, setExtensionObject] = useState<IExtension>(
    initialObject
  );
  const [tab, setTab] = useState("triggersRequirements");
  const [validation, setValidation, validationRef] = useStateRef({
    condition: true,
    extensionBody: true,
  });
  const [, setConditionEditorActive, conditionEditorActiveRef] = useStateRef(
    false
  );
  const [, setBodyEditorActive, bodyEditorActiveRef] = useStateRef(false);
  const { tableState } = useRowyContext();
  const columns = Object.keys(tableState?.columns ?? {});
  const edited = !_isEqual(initialObject, extensionObject);

  const handleAddOrUpdate = () => {
    switch (mode) {
      case "add":
        handleAdd(extensionObject);
        return;
      case "update":
        handleUpdate(extensionObject);
        return;
    }
  };

  return (
    <Modal
      onClose={handleClose}
      maxWidth="md"
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth
      fullHeight
      sx={{
        "& .MuiDialogContent-root": {
          display: "flex",
          flexDirection: "column",
        },
      }}
      title={`${mode === "add" ? "Add" : "Update"} Extension`}
      children={
        <>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={4}>
              <TextField
                size="small"
                required
                label="Extension Name"
                variant="filled"
                fullWidth
                autoFocus
                value={extensionObject.name}
                error={edited && !extensionObject.name.length}
                helperText={
                  edited && !extensionObject.name.length ? "Required" : " "
                }
                onChange={(event) => {
                  setExtensionObject({
                    ...extensionObject,
                    name: event.target.value,
                  });
                }}
              />
            </Grid>

            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={extensionObject.active}
                    onChange={(e) =>
                      setExtensionObject({
                        ...extensionObject,
                        active: e.target.checked,
                      })
                    }
                    size="medium"
                  />
                }
                label={`Extension is ${
                  !extensionObject.active ? "de" : ""
                }activated`}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                size="small"
                label="Extension Type"
                value={extensionObject.type}
                variant="filled"
                fullWidth
                disabled
                helperText="Cannot be changed once created"
              />
            </Grid>
          </Grid>

          <TabContext value={tab}>
            <TabList
              aria-label="Extension settings tabs"
              onChange={(_, val) => setTab(val)}
              variant="fullWidth"
              centered
              style={{
                marginTop: 0,
                marginLeft: "calc(var(--dialog-spacing) * -1)",
                marginRight: "calc(var(--dialog-spacing) * -1)",
              }}
            >
              <Tab
                value="triggersRequirements"
                label="Triggers & Requirements"
              />
              <Tab value="parameters" label="Parameters" />
            </TabList>
            <Divider
              style={{
                marginTop: -1,
                marginLeft: "calc(var(--dialog-spacing) * -1)",
                marginRight: "calc(var(--dialog-spacing) * -1)",
              }}
            />

            <StyledTabPanel value="triggersRequirements">
              <Grid
                container
                spacing={3}
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Grid item xs={12} sm={6}>
                  <FormControl component="fieldset" required>
                    <FormLabel
                      component="legend"
                      sx={{
                        typography: "subtitle2",
                        color: "text.primary",
                        mb: 1,
                      }}
                    >
                      Triggers
                    </FormLabel>
                    <Typography gutterBottom>
                      Select a trigger that runs your extension code. Selected
                      actions on any cells will trigger the extension.
                    </Typography>

                    <FormGroup>
                      {triggerTypes.map((trigger) => (
                        <FormControlLabel
                          label={trigger}
                          control={
                            <Checkbox
                              checked={extensionObject.triggers.includes(
                                trigger
                              )}
                              name={trigger}
                              onChange={() => {
                                if (
                                  extensionObject.triggers.includes(trigger)
                                ) {
                                  setExtensionObject({
                                    ...extensionObject,
                                    triggers: extensionObject.triggers.filter(
                                      (t) => t !== trigger
                                    ),
                                  });
                                } else {
                                  setExtensionObject({
                                    ...extensionObject,
                                    triggers: [
                                      ...extensionObject.triggers,
                                      trigger,
                                    ],
                                  });
                                }
                              }}
                            />
                          }
                        />
                      ))}
                    </FormGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl component="fieldset">
                    <FormLabel
                      component="legend"
                      sx={{
                        typography: "subtitle2",
                        color: "text.primary",
                        mb: 1,
                      }}
                    >
                      Required Fields (optional)
                    </FormLabel>
                    <Typography gutterBottom>
                      Optionally, select the fields that are required for the
                      extension to be triggered for a row.
                    </Typography>

                    <FormGroup
                      sx={{
                        maxHeight: 42 * 3.5,
                        overflowY: "auto",
                        flexWrap: "nowrap",
                        borderBottom: 1,
                        borderColor: "divider",
                        "& > *": { flexShrink: 0 },
                      }}
                    >
                      {columns.sort().map((field) => (
                        <FormControlLabel
                          label={field}
                          control={
                            <Checkbox
                              checked={extensionObject.requiredFields.includes(
                                field
                              )}
                              name={field}
                              onChange={() => {
                                if (
                                  extensionObject.requiredFields.includes(field)
                                ) {
                                  setExtensionObject({
                                    ...extensionObject,
                                    requiredFields: extensionObject.requiredFields.filter(
                                      (t) => t !== field
                                    ),
                                  });
                                } else {
                                  setExtensionObject({
                                    ...extensionObject,
                                    requiredFields: [
                                      ...extensionObject.requiredFields,
                                      field,
                                    ],
                                  });
                                }
                              }}
                            />
                          }
                        />
                      ))}

                      {extensionObject.requiredFields.map((trigger, index) => {
                        const isRowyColumn = columns.includes(trigger);
                        if (isRowyColumn) {
                          return null;
                        }

                        return (
                          <Stack
                            direction="row"
                            alignItems="center"
                            sx={{ ml: -1.25, height: 42 }}
                          >
                            <IconButton
                              color="secondary"
                              component="span"
                              aria-label="Delete Firestore Field"
                              onClick={() => {
                                setExtensionObject({
                                  ...extensionObject,
                                  requiredFields: extensionObject.requiredFields.filter(
                                    (t) => t !== trigger
                                  ),
                                });
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                            <TextField
                              id={`extensions-requiredFields-firestoreField-${index}`}
                              label="Firestore Field"
                              sx={{
                                flexDirection: "row",
                                alignItems: "baseline",
                                "& .MuiInputLabel-root": { pl: 0, pr: 1 },
                              }}
                              value={trigger}
                              onChange={(event) => {
                                setExtensionObject({
                                  ...extensionObject,
                                  requiredFields: extensionObject.requiredFields.map(
                                    (value, i) =>
                                      i === index ? event.target.value : value
                                  ),
                                });
                              }}
                            />
                          </Stack>
                        );
                      })}

                      <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        sx={{ height: 42, ml: -0.75 }}
                      >
                        <Button
                          variant="text"
                          color="secondary"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            setExtensionObject({
                              ...extensionObject,
                              requiredFields: [
                                ...extensionObject.requiredFields,
                                "",
                              ],
                            });
                          }}
                        >
                          Add Firestore Field
                        </Button>
                      </Stack>
                    </FormGroup>
                  </FormControl>
                </Grid>
              </Grid>

              <div style={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Conditions
                </Typography>

                <CodeEditor
                  script={extensionObject.conditions}
                  height="100%"
                  handleChange={(newValue) => {
                    setExtensionObject({
                      ...extensionObject,
                      conditions: newValue,
                    });
                  }}
                  onValideStatusUpdate={({ isValid }) => {
                    if (!conditionEditorActiveRef.current) {
                      return;
                    }
                    setValidation({
                      ...validationRef.current,
                      condition: isValid,
                    });
                    console.log(validationRef.current);
                  }}
                  diagnosticsOptions={{
                    noSemanticValidation: false,
                    noSyntaxValidation: false,
                    noSuggestionDiagnostics: true,
                  }}
                  onMount={() => {
                    setConditionEditorActive(true);
                  }}
                  onUnmount={() => {
                    setConditionEditorActive(false);
                  }}
                />
              </div>
              <CodeEditorHelper
                docLink={WIKI_LINKS.extensions}
                additionalVariables={additionalVariables}
              />
            </StyledTabPanel>

            <StyledTabPanel value="parameters">
              <div style={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Extension Body
                </Typography>

                <CodeEditor
                  script={extensionObject.extensionBody}
                  height="100%"
                  handleChange={(newValue) => {
                    setExtensionObject({
                      ...extensionObject,
                      extensionBody: newValue,
                    });
                  }}
                  onValidStatusUpdate={({ isValid }) => {
                    if (!bodyEditorActiveRef.current) {
                      return;
                    }
                    setValidation({
                      ...validationRef.current,
                      extensionBody: isValid,
                    });
                    console.log(validationRef.current);
                  }}
                  diagnosticsOptions={{
                    noSemanticValidation: false,
                    noSyntaxValidation: false,
                    noSuggestionDiagnostics: true,
                  }}
                  onMount={() => {
                    setBodyEditorActive(true);
                  }}
                  onUnmount={() => {
                    setBodyEditorActive(false);
                  }}
                />
              </div>
              <CodeEditorHelper
                docLink={WIKI_LINKS.extensions}
                additionalVariables={additionalVariables}
              />
            </StyledTabPanel>
          </TabContext>
        </>
      }
      actions={{
        primary: {
          children: mode === "add" ? "Add" : "Update",
          disabled: !edited || !extensionObject.name.length,
          onClick: () => {
            let warningMessage;
            if (!validation.condition && !validation.extensionBody) {
              warningMessage = "Condition and extension body are not valid";
            } else if (!validation.condition) {
              warningMessage = "Condition is not valid";
            } else if (!validation.extensionBody) {
              warningMessage = "Extension body is not valid";
            }

            if (warningMessage) {
              requestConfirmation({
                title: "Validation Failed",
                body: `${warningMessage}. Continue?`,
                confirm: "Yes, I know what I’m doing",
                cancel: "No, I’ll fix the errors",
                handleConfirm: handleAddOrUpdate,
              });
            } else {
              handleAddOrUpdate();
            }
          },
        },
      }}
    />
  );
}
