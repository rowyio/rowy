import React, { useState } from "react";
import { FieldProps } from "formik";

import {
  makeStyles,
  createStyles,
  FormControl,
  Grid,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Cancel";

import Label from "../Label";
import ErrorMessage from "../ErrorMessage";

const useStyles = makeStyles(theme =>
  createStyles({
    root: { display: "flex" },
    list: { marginBottom: theme.spacing(2) },
  })
);

export interface ITextMultiProps extends FieldProps {
  label: React.ReactNode;
  addItemLabel?: string;
  addItemPlaceholder?: string;
}

export default function TextMulti({
  form,
  field,
  label,
  addItemLabel,
  addItemPlaceholder,
}: ITextMultiProps) {
  const classes = useStyles();
  const [itemToAdd, setItemToAdd] = useState("");

  const handleAddToList = () => {
    if (Array.isArray(field.value))
      form.setFieldValue(field.name, [...field.value, itemToAdd]);
    else form.setFieldValue(field.name, [itemToAdd]);
    setItemToAdd("");
  };
  const handleDeleteFromList = (i: number) => {
    if (!Array.isArray(field.value)) form.setFieldValue(field.name, []);
    const newValues = [...field.value];
    newValues.splice(i, 1);
    form.setFieldValue(field.name, newValues);
  };

  return (
    <FormControl className={classes.root}>
      <Label error={!!(form.errors[field.name] && form.touched[field.name])}>
        {label}
      </Label>

      <List className={classes.list} disablePadding>
        {Array.isArray(field.value) &&
          field.value.map((item: string, i: number) => (
            <React.Fragment key={i}>
              <ListItem>
                <ListItemText primary={item} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="Remove"
                    onClick={() => {
                      handleDeleteFromList(i);
                      form.setFieldTouched(field.name);
                    }}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
      </List>

      <Grid container alignItems="center" spacing={1}>
        <Grid item>
          <IconButton
            onClick={() => {
              handleAddToList();
              form.setFieldTouched(field.name);
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Grid>

        <Grid item xs>
          <TextField
            id={`${field.name}-temp`}
            type="text"
            onChange={e => setItemToAdd(e.target.value)}
            variant="filled"
            fullWidth
            value={itemToAdd}
            label={addItemLabel || `Add ${label}`}
            placeholder={addItemPlaceholder}
            onKeyPress={e => {
              if (e.key === "Enter") handleAddToList();
            }}
            // NOTE: Field is not automatically touched, has to be set here
            onBlur={() => form.setFieldTouched(field.name)}
          />
        </Grid>
      </Grid>

      <ErrorMessage name={field.name} />
    </FormControl>
  );
}
