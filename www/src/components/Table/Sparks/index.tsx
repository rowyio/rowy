import React from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import Divider from "@material-ui/core/Divider";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import SparksIcon from "@material-ui/icons/OfflineBolt";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/DeleteForever";
import { useFiretableContext } from "contexts/FiretableContext";
import Grid from "@material-ui/core/Grid";
import Form from "@antlerengineering/form-builder";
import { newSparkForm } from "./forms";

const NewSpark = ({ handleAddSpark }) => {
  const { tableState } = useFiretableContext();
  const columns = Object.keys(tableState?.columns as any);
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleClickOpen} variant="outlined">
        + Add a spark
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Form
            fields={newSparkForm(columns)}
            values={{}}
            onSubmit={(values) => {
              handleAddSpark(values);
              handleClose();
            }}
            SubmitButtonProps={{ label: "Create A New Spark" }}
            customComponents={
              {
                // image: { component: ImageUploader, defaultValue: [] },
                // file: { component: FileUploader, defaultValue: [] },
                // founderSelect: { component: FounderSelect, defaultValue: [] },
              }
            }
          />{" "}
        </DialogContent>
      </Dialog>
    </>
  );
};
export default function Sparks() {
  const { tableState } = useFiretableContext();
  const columns = Object.keys(tableState?.columns as any);
  const tableConfigDoc = tableState?.config?.tableConfig?.doc;
  const sparks = tableConfigDoc?.sparks ?? [];
  const handleDeleteSpark = (index) => () => {
    const _sparks = [...sparks];
    _sparks.splice(index, 1);
    tableConfigDoc.ref.update({ sparks: _sparks });
  };

  const handleAddSpark = (spark) => {
    const _sparks = [...sparks, spark];
    tableConfigDoc.ref.update({ sparks: _sparks });
  };

  const [open, setOpen] = React.useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={handleClickOpen} color="secondary">
        <Tooltip title="Sparks">
          <SparksIcon />
        </Tooltip>
      </IconButton>
      <Dialog
        //fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="Sparks-settings-dialog"
      >
        <DialogTitle id="Sparks-dialog-title">{`${tableState?.tablePath} Sparks configuration`}</DialogTitle>
        <DialogContent>
          <Grid direction="row">
            {sparks.length > 0 ? (
              <>
                {sparks.map((spark, index) => (
                  <>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justify="space-between"
                    >
                      <Typography variant="overline">{spark.type}</Typography>
                      <Typography>{spark.label}</Typography>
                      <Grid item>
                        {" "}
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={handleDeleteSpark(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                    <Divider />
                  </>
                ))}
              </>
            ) : (
              <DialogContentText>Add a spark to get started</DialogContentText>
            )}
            <NewSpark handleAddSpark={handleAddSpark} />
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
