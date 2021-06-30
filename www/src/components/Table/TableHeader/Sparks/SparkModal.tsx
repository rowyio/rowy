import React, { useState } from "react";
import { parseSparkConfig, serialiseSpark, ISpark } from "./utils";
import EmptyState from "components/EmptyState";
import BackIcon from "@material-ui/icons/ArrowBack";
import Modal from "components/Modal";
import CodeEditor from "../../editors/CodeEditor";
import { useFiretableContext } from "contexts/FiretableContext";
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
  // sparks: ISpark[];
  handleClose: () => void;
  handleSave: () => void;
}

export default function SparkModal({
  handleClose,
  handleSave,
}: ISparkModalProps) {
  const [activated, setActivated] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [firestoreFields, setFirestoreFields] = useState<string[]>([]);
  const classes = useStyles();
  const { tableState } = useFiretableContext();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleNewField = () => {
    setFirestoreFields([...firestoreFields, ""]);
  };

  const handleUpdateField = (newValue, index) => {
    setFirestoreFields(
      firestoreFields.map((value, i) => (i === index ? newValue : value))
    );
  };

  const handleRemoveField = (index) => {
    setFirestoreFields(firestoreFields.filter((_, i) => i !== index));
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
                label="Spark Name"
                variant="filled"
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <Box
                display="flex"
                alignItems="center"
                className={classes.hoverable}
                onClick={() => {
                  setActivated(!activated);
                }}
              >
                <Switch color="primary" checked={activated} />
                <Typography>Spark is {!activated && "de"}activated</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Tooltip title="Spark type cannot be changed once created.">
                <TextField
                  size="small"
                  label="Spark Type"
                  value="task"
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
                  {["create", "update", "delete"].map((trigger, index) => (
                    <Box
                      display="flex"
                      alignItems="center"
                      className={classes.hoverable}
                    >
                      <Checkbox
                        checked={false}
                        onChange={() => {
                          console.log("yay");
                        }}
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
                  {tableState?.columns &&
                    Object.keys(tableState?.columns).map((trigger) => (
                      <Box
                        display="flex"
                        alignItems="center"
                        className={classes.hoverable}
                      >
                        <Checkbox
                          checked={false}
                          onChange={() => {
                            console.log("yay");
                          }}
                          name={trigger}
                        />
                        <Typography>{trigger}</Typography>
                      </Box>
                    ))}
                  {firestoreFields.map((trigger, index) => (
                    <Box display="flex" alignItems="center">
                      <IconButton
                        color="secondary"
                        component="span"
                        className={classes.removeField}
                        onClick={() => {
                          handleRemoveField(index);
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
                          handleUpdateField(event.target.value, index);
                        }}
                      />
                    </Box>
                  ))}
                  <Button
                    variant="text"
                    color="secondary"
                    className={classes.addField}
                    startIcon={<AddIcon />}
                    onClick={handleNewField}
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
                  script={"currentSparks"}
                  height="100%"
                  handleChange={(newValue) => {
                    // setLocalSparks(newValue);
                  }}
                  onValideStatusUpdate={({ isValid }) => {
                    // setIsSparksValid(isValid);
                  }}
                  diagnosticsOptions={{
                    noSemanticValidation: false,
                    noSyntaxValidation: false,
                    noSuggestionDiagnostics: true,
                  }}
                />
              </Box>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <Box className={classes.tabPanel} flexGrow={1}>
                {/* TODO add editor help info */}
                <Typography variant="overline" className={classes.label}>
                  Spark Body
                </Typography>
                {/* TODO break spark body fields into editable UI components */}
                <CodeEditor
                  script={"currentSparks"}
                  height="100%"
                  handleChange={(newValue) => {
                    // setLocalSparks(newValue);
                  }}
                  onValideStatusUpdate={({ isValid }) => {
                    // setIsSparksValid(isValid);
                  }}
                  diagnosticsOptions={{
                    noSemanticValidation: false,
                    noSyntaxValidation: false,
                    noSuggestionDiagnostics: true,
                  }}
                />
              </Box>
            </TabPanel>
          </Box>
        </Box>
      }
      actions={{
        primary: {
          children: "Update Settings",
          onClick: handleSave,
        },
      }}
    />
  );
}
