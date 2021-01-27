import React, { useState } from "react";
import _sortBy from "lodash/sortBy";
import _includes from "lodash/includes";
import _camelCase from "lodash/camelCase";

import {
  createStyles,
  makeStyles,
  TextField,
  Grid,
  IconButton,
  Typography,
  Divider,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/AddCircle";
import RemoveIcon from "@material-ui/icons/CancelRounded";

import Subheading from "components/Table/ColumnMenu/Subheading";

const useStyles = makeStyles(() =>
  createStyles({
    field: {
      width: "100%",
    },
    optionsList: {
      maxHeight: 150,
      overflowX: "scroll",
    },
  })
);

export default function Settings({ handleChange, config }) {
  const options = config.options ?? [];
  const classes = useStyles();
  const [newOption, setNewOption] = useState("");
  const handleAdd = () => {
    if (newOption.trim() !== "") {
      handleChange("options")([...options, newOption.trim()]);
      setNewOption("");
    }
  };

  return (
    <>
      <Subheading>Single Select Config</Subheading>
      <div className={classes.optionsList}>
        {options?.map((option: string) => (
          <>
            <Grid
              container
              direction="row"
              key={`option-${option}`}
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography>{option}</Typography>
              </Grid>
              <Grid item>
                <IconButton
                  aria-label="remove"
                  onClick={(e: any) =>
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
      </div>

      <Grid container direction="row">
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
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
