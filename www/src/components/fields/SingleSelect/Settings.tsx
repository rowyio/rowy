import React,{useState} from "react";
import SettingsHeading from "components/Table/ColumnMenu/Settings/SettingsHeading";
import _sortBy from "lodash/sortBy";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import _includes from "lodash/includes";
import _camelCase from "lodash/camelCase";
import AddIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import RemoveIcon from "@material-ui/icons/CancelRounded";
const useStyles = makeStyles((Theme) =>
  createStyles({
    root: {},
    field: {
      width: "100%",
    },
    optionsList :{
      maxHeight:150,
      overflowX:'scroll'
    }
  })
);

const Settings = ({ handleChange, config }) => {

  const options = config.options ?? []
  const classes = useStyles();
  const [newOption, setNewOption] = useState("");
  const handleAdd = () => {
    if (newOption.trim() !== "") {
      handleChange('options')([...options, newOption.trim()]);
      setNewOption("");
    }
  };
  const handleDelete = (optionToDelete: string) => () =>
    handleChange('options')(options.filter((option: string) => option !== optionToDelete));

  return (
    <>
      <SettingsHeading>Single Select Config</SettingsHeading>
      <div className={classes.optionsList}>
      {options?.map((option:string) =>
      <><Grid container direction='row' key={`option-${option}`} justify="space-between" alignItems='center'>
      <Grid item>
        <Typography>
          {option}
        </Typography>
      </Grid>
      <Grid item>
      <IconButton
                  aria-label="remove"
                  onClick={(e: any) => {
                    handleDelete(option);
                  }}
                >
                  {<RemoveIcon />}
                </IconButton>
                  </Grid>
                  </Grid>
                  <Divider/>
                  </>
                  )}
      
        </div>

     <Grid container direction='row'>
      <Grid item>
      <IconButton
                  aria-label="add new"
                  onClick={(e: any) => {
                    handleAdd();
                  }}
                >
                  {<AddIcon />}
                </IconButton>
                  </Grid>
      <Grid item xs={10} md={11}>

                <TextField
          value={newOption}
          className={classes.field}
          fullWidth
          label={"New Option"}
          onChange={(e) => {
            setNewOption(e.target.value);
          }}
          onKeyPress={(e: any) => {
            if (e.key === "Enter") {
              handleAdd();
            }
          }}/>
                  </Grid>

          </Grid>
         
    </>
  );
};

export default Settings;
