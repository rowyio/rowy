import { useState, useRef } from "react";

import { makeStyles, createStyles } from "@mui/styles";
import {
  InputLabel,
  TextField,
  Grid,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/AddCircle";
import RemoveIcon from "@mui/icons-material/CancelRounded";

import Subheading from "components/Table/ColumnMenu/Subheading";

const useStyles = makeStyles(() =>
  createStyles({
    field: {
      width: "100%",
    },
    optionsList: {
      maxHeight: 180,
      overflowY: "scroll",
      overflowX: "hidden",
      marginBottom: 5,
    },
  })
);

export default function Settings({ handleChange, config }) {
  const listEndRef: any = useRef(null);
  const options = config.options ?? [];
  const classes = useStyles();
  const [newOption, setNewOption] = useState("");
  const handleAdd = () => {
    if (newOption.trim() !== "") {
      handleChange("options")([...options, newOption.trim()]);
      setNewOption("");
      listEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  return (
    <div>
      <InputLabel>Options</InputLabel>
      <div className={classes.optionsList}>
        {options?.map((option: string) => (
          <>
            <Grid
              container
              direction="row"
              key={`option-${option}`}
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography>{option}</Typography>
              </Grid>
              <Grid item>
                <IconButton
                  aria-label="Remove"
                  onClick={() =>
                    handleChange("options")(
                      options.filter((o: string) => o !== option)
                    )
                  }
                >
                  {<RemoveIcon />}
                </IconButton>
              </Grid>
            </Grid>
            <Divider />
          </>
        ))}
        <div ref={listEndRef} style={{ height: 40 }} />
      </div>

      <Grid container direction="row" alignItems="center">
        <Grid item>
          <IconButton
            aria-label="Add new"
            onClick={() => {
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
            label="New option"
            id="new-option"
            onChange={(e) => {
              setNewOption(e.target.value);
            }}
            onKeyPress={(e: any) => {
              if (e.key === "Enter") {
                handleAdd();
              }
            }}
            helperText=" "
          />
        </Grid>
      </Grid>
    </div>
  );
}
