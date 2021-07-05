import React, { useState } from "react";
import _isEqual from "lodash/isEqual";
import useStateRef from "react-usestateref";
import { ISpark, triggerTypes } from "./utils";
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
    description: "triggerType indicates the type of the spark invocation",
  },
  {
    key: "fieldTypes",
    description:
      "fieldTypes is a map of all fields and its corresponding Firetable column type",
  },
  {
    key: "sparkConfig",
    description:
      "you can pass in field name to change.before.get() or change.after.get() to get changes",
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

export interface ISparkModalProps {
  handleClose: () => void;
  handleAdd: (sparkObject: ISpark) => void;
  handleUpdate: (sparkObject: ISpark) => void;
  mode: "add" | "update";
  sparkObject: ISpark;
}

export default function SparkModal({
  handleClose,
  handleAdd,
  handleUpdate,
  mode,
  sparkObject: initialObject,
}: ISparkModalProps) {
  const { requestConfirmation } = useConfirmation();
  const [sparkObject, setSparkObject] = useState<ISpark>(initialObject);
  const [tabIndex, setTabIndex] = useState(0);
  const [validation, setValidation, validationRef] = useStateRef({
    condition: true,
    sparkBody: true,
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
  const edited = !_isEqual(initialObject, sparkObject);

  const handleChange = (_, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleAddOrUpdate = () => {
    switch (mode) {
      case "add":
        handleAdd(sparkObject);
        return;
      case "update":
        handleUpdate(sparkObject);
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
          SPARKS
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
                  edited && !sparkObject.name.length
                    ? "Spark name (required)"
                    : "Spark name"
                }
                variant="filled"
                fullWidth
                value={sparkObject.name}
                error={edited && !sparkObject.name.length}
                onChange={(event) => {
                  setSparkObject({
                    ...sparkObject,
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
                  setSparkObject({
                    ...sparkObject,
                    active: !sparkObject.active,
                  });
                }}
              >
                <Switch color="primary" checked={sparkObject.active} />
                <Typography>
                  Spark is {!sparkObject.active && "de"}activated
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Tooltip title="Spark type cannot be changed once created.">
                <TextField
                  size="small"
                  label="Spark Type"
                  value={sparkObject.type}
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
            <AppBar position="static" className={classes.tabRoot}>
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
                    Select a trigger that runs your spark code. Selected actions
                    on any cells will trigger the spark.
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
                        if (sparkObject.triggers.includes(trigger)) {
                          setSparkObject({
                            ...sparkObject,
                            triggers: sparkObject.triggers.filter(
                              (t) => t !== trigger
                            ),
                          });
                        } else {
                          setSparkObject({
                            ...sparkObject,
                            triggers: [...sparkObject.triggers, trigger],
                          });
                        }
                      }}
                    >
                      <Checkbox
                        checked={sparkObject.triggers.includes(trigger)}
                        name={trigger}
                      />
                      <Typography>{trigger}</Typography>
                    </Box>
                  ))}
                </Grid>
                <Grid item xs={6} className={classes.requiredFields}>
                  <Typography variant="body2">
                    Any cell can trigger a spark, only when the required fields
                    of its row has values in them. Select your requried fields
                    (optional.)
                  </Typography>
                  <Box>
                    <Typography variant="overline" className={classes.label}>
                      Required Fields (Optional)
                    </Typography>
                  </Box>
                  {columns.map((field) => (
                    <Box
                      display="flex"
                      alignItems="center"
                      className={classes.hoverable}
                      onClick={() => {
                        if (sparkObject.requiredFields.includes(field)) {
                          setSparkObject({
                            ...sparkObject,
                            requiredFields: sparkObject.requiredFields.filter(
                              (t) => t !== field
                            ),
                          });
                        } else {
                          setSparkObject({
                            ...sparkObject,
                            requiredFields: [
                              ...sparkObject.requiredFields,
                              field,
                            ],
                          });
                        }
                      }}
                    >
                      <Checkbox
                        checked={sparkObject.requiredFields.includes(field)}
                        name={field}
                      />
                      <Typography>{field}</Typography>
                    </Box>
                  ))}
                  {sparkObject.requiredFields.map((trigger, index) => {
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
                            setSparkObject({
                              ...sparkObject,
                              requiredFields: sparkObject.requiredFields.filter(
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
                            setSparkObject({
                              ...sparkObject,
                              requiredFields: sparkObject.requiredFields.map(
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
                      setSparkObject({
                        ...sparkObject,
                        requiredFields: [...sparkObject.requiredFields, ""],
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
                  script={sparkObject.shouldRun}
                  height="100%"
                  handleChange={(newValue) => {
                    setSparkObject({
                      ...sparkObject,
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
                docLink="https://github.com/FiretableProject/firetable/wiki/Sparks"
                additionalVariables={additionalVariables}
              />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <Box className={classes.tabPanel} flexGrow={1}>
                <Typography variant="overline" className={classes.label}>
                  Spark Body
                </Typography>
                <CodeEditor
                  script={sparkObject.sparkBody}
                  height="100%"
                  handleChange={(newValue) => {
                    setSparkObject({
                      ...sparkObject,
                      sparkBody: newValue,
                    });
                  }}
                  onValideStatusUpdate={({ isValid }) => {
                    if (!bodyEditorActiveRef.current) {
                      return;
                    }
                    setValidation({
                      ...validationRef.current,
                      sparkBody: isValid,
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
                docLink="https://github.com/FiretableProject/firetable/wiki/Sparks"
                additionalVariables={additionalVariables}
              />
            </TabPanel>
          </Box>
        </Box>
      }
      actions={{
        primary: {
          children: mode === "add" ? "Add" : "Update",
          disabled: !edited || !sparkObject.name.length,
          onClick: () => {
            let warningMessage;
            if (!validation.condition && !validation.sparkBody) {
              warningMessage = "Condition and spark body are not valid";
            } else if (!validation.condition) {
              warningMessage = "Condition is not valid";
            } else if (!validation.sparkBody) {
              warningMessage = "Spark body is not valid";
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
