import { useState, useRef } from "react";
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
    <>
      <Subheading>OPTIONS</Subheading>
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
        <div ref={listEndRef} style={{ height: 40 }} />
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
