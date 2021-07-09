import React, { useState } from "react";
import _isEqual from "lodash/isEqual";
import useStateRef from "react-usestateref";
import { IExtension, triggerTypes } from "./utils";
import Modal from "components/Modal";
import CodeEditorHelper from "components/CodeEditorHelper";
import { useConfirmation } from "components/ConfirmationDialog";
import CodeEditor from "../../editors/CodeEditor";
import { useFiretableContext } from "contexts/FiretableContext";
import BackIcon from "@material-ui/icons/ArrowBack";
import AddIcon from "@material-ui/icons/AddBox";
import DeleteIcon from "@material-ui/icons/RemoveCircle";
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  makeStyles,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";

const additionalVariables = [
  {
    key: "change",
    description:
      "you can pass in field name to change.before.get() or change.after.get() to get changes",
  },
  {
    key: "triggerType",
    description: "triggerType indicates the type of the extention invocation",
  },
  {
    key: "fieldTypes",
    description:
      "fieldTypes is a map of all fields and its corresponding Firetable column type",
  },
  {
    key: "extensionConfig",
    description: "the configuration object of this extension",
  },
];

const useStyles = makeStyles((theme) => ({
  modalRoot: {
    height: `calc(100vh - 250px)`,
  },
  metaRoot: {
    marginBottom: theme.spacing(2),
  },
  tabWrapper: {
    backgroundColor: theme.palette.background.default,
  },
  tabRoot: {
    backgroundColor: theme.palette.background.paper,
  },
  tabPanel: {
    padding: 0,
  },
  label: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    display: "block",
  },
  hoverable: {
    borderRadius: theme.spacing(1),
    cursor: "pointer",
    padding: theme.spacing(1, 0),
    "&:hover": {
      background: theme.palette.background.paper,
    },
  },
  requiredFields: {
    maxHeight: `max(300px, 30vh)`,
    overflowY: "scroll",
  },
  addField: {
    paddingLeft: 13, // align icons to the left
  },
  removeField: {
    marginLeft: -3, // align icons to the left
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ height: "100%" }}
      {...other}
    >
      {value === index && (
        <Box
          style={{ height: "100%" }}
          p={3}
          display="flex"
          flexDirection="column"
        >
          {children}
        </Box>
      )}
    </div>
  );
}

export interface IExtensionModalProps {
  handleClose: () => void;
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
  const [tabIndex, setTabIndex] = useState(0);
  const [validation, setValidation, validationRef] = useStateRef({
    condition: true,
    extensionBody: true,
  });
  const [
    conditionEditorActive,
    setConditionEditorActive,
    conditionEditorActiveRef,
  ] = useStateRef(false);
  const [
    bodyEditorActive,
    setBodyEditorActive,
    bodyEditorActiveRef,
  ] = useStateRef(false);
  const classes = useStyles();
  const { tableState } = useFiretableContext();
  const columns = Object.keys(tableState?.columns ?? {});
  const edited = !_isEqual(initialObject, extensionObject);

  const handleChange = (_, newValue: number) => {
    setTabIndex(newValue);
  };

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
      maxWidth="lg"
      fullWidth
      title={
        <Button
          color="secondary"
          startIcon={<BackIcon />}
          onClick={handleClose}
        >
          EXTENSIONS
        </Button>
      }
      children={
        <Box
          className={classes.modalRoot}
          display="flex"
          flexDirection="column"
        >
          <Grid
            container
            spacing={3}
            justify="center"
            alignItems="center"
            className={classes.metaRoot}
          >
            <Grid item xs={4}>
              <TextField
                size="small"
                label={
                  edited && !extensionObject.name.length
                    ? "Extension name (required)"
                    : "Extension name"
                }
                variant="filled"
                fullWidth
                value={extensionObject.name}
                error={edited && !extensionObject.name.length}
                onChange={(event) => {
                  setExtensionObject({
                    ...extensionObject,
                    name: event.target.value,
                  });
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <Box
                display="flex"
                alignItems="center"
                className={classes.hoverable}
                onClick={() => {
                  setExtensionObject({
                    ...extensionObject,
                    active: !extensionObject.active,
                  });
                }}
              >
                <Switch color="primary" checked={extensionObject.active} />
                <Typography>
                  Extention is {!extensionObject.active && "de"}activated
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Tooltip title="Extension type cannot be changed once created.">
                <TextField
                  size="small"
                  label="Extension Type"
                  value={extensionObject.type}
                  variant="filled"
                  fullWidth
                  disabled
                />
              </Tooltip>
            </Grid>
          </Grid>
          <Box
            className={classes.tabWrapper}
            flexGrow={1}
            display="flex"
            flexDirection="column"
          >
            <AppBar position="static" className={classes.tabRoot} elevation={0}>
              <Tabs
                value={tabIndex}
                onChange={handleChange}
                variant="fullWidth"
                centered
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Triggers & Requirements" />
                <Tab label="Parameters" />
              </Tabs>
            </AppBar>
            <TabPanel value={tabIndex} index={0}>
              <Grid
                container
                spacing={3}
                justify="center"
                alignItems="flex-start"
              >
                <Grid item xs={6}>
                  <Typography variant="body2">
                    Select a trigger that runs your extension code. Selected
                    actions on any cells will trigger the extension.
                  </Typography>
                  <Box>
                    <Typography variant="overline" className={classes.label}>
                      Triggers
                    </Typography>
                  </Box>
                  {triggerTypes.map((trigger) => (
                    <Box
                      display="flex"
                      alignItems="center"
                      className={classes.hoverable}
                      onClick={() => {
                        if (extensionObject.triggers.includes(trigger)) {
                          setExtensionObject({
                            ...extensionObject,
                            triggers: extensionObject.triggers.filter(
                              (t) => t !== trigger
                            ),
                          });
                        } else {
                          setExtensionObject({
                            ...extensionObject,
                            triggers: [...extensionObject.triggers, trigger],
                          });
                        }
                      }}
                    >
                      <Checkbox
                        checked={extensionObject.triggers.includes(trigger)}
                        name={trigger}
                      />
                      <Typography>{trigger}</Typography>
                    </Box>
                  ))}
                </Grid>
                <Grid item xs={6} className={classes.requiredFields}>
                  <Typography variant="body2">
                    Any cell can trigger a extension, only when the required
                    fields of its row has values in them. Select your requried
                    fields (optional.)
                  </Typography>
                  <Box>
                    <Typography variant="overline" className={classes.label}>
                      Required Fields (Optional)
                    </Typography>
                  </Box>
                  {columns.sort().map((field) => (
                    <Box
                      display="flex"
                      alignItems="center"
                      className={classes.hoverable}
                      onClick={() => {
                        if (extensionObject.requiredFields.includes(field)) {
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
                    >
                      <Checkbox
                        checked={extensionObject.requiredFields.includes(field)}
                        name={field}
                      />
                      <Typography>{field}</Typography>
                    </Box>
                  ))}
                  {extensionObject.requiredFields.map((trigger, index) => {
                    const isFiretableColumn = columns.includes(trigger);
                    if (isFiretableColumn) {
                      return null;
                    }

                    return (
                      <Box display="flex" alignItems="center">
                        <IconButton
                          color="secondary"
                          component="span"
                          className={classes.removeField}
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
                          label="Firestore field"
                          variant="outlined"
                          value={trigger}
                          size="small"
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
                      </Box>
                    );
                  })}
                  <Button
                    variant="text"
                    color="secondary"
                    className={classes.addField}
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setExtensionObject({
                        ...extensionObject,
                        requiredFields: [...extensionObject.requiredFields, ""],
                      });
                    }}
                  >
                    Add a new Firestore field
                  </Button>
                </Grid>
              </Grid>
              <Box className={classes.tabPanel} flexGrow={1}>
                <Typography variant="overline" className={classes.label}>
                  Conditions
                </Typography>
                <CodeEditor
                  script={extensionObject.shouldRun}
                  height="100%"
                  handleChange={(newValue) => {
                    setExtensionObject({
                      ...extensionObject,
                      shouldRun: newValue,
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
              </Box>
              <CodeEditorHelper
                docLink="https://github.com/FiretableProject/firetable/wiki/Extensions"
                additionalVariables={additionalVariables}
              />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <Box className={classes.tabPanel} flexGrow={1}>
                <Typography variant="overline" className={classes.label}>
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
                  onValideStatusUpdate={({ isValid }) => {
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
              </Box>
              <CodeEditorHelper
                docLink="https://github.com/FiretableProject/firetable/wiki/Extensions"
                additionalVariables={additionalVariables}
              />
            </TabPanel>
          </Box>
        </Box>
      }
      actions={{
        primary: {
          children: mode === "add" ? "Add" : "Update",
          disabled: !edited || !extensionObject.name.length,
          onClick: () => {
            let warningMessage;
            if (!validation.condition && !validation.extensionBody) {
              warningMessage = "Condition and extention body are not valid";
            } else if (!validation.condition) {
              warningMessage = "Condition is not valid";
            } else if (!validation.extensionBody) {
              warningMessage = "Extention body is not valid";
            }

            if (warningMessage) {
              requestConfirmation({
                title: "Validation failed",
                body: `${warningMessage}, do you want to continue?`,
                confirm: "Yes, I know what I am doing",
                cancel: "No, I'll fix the errors",
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
