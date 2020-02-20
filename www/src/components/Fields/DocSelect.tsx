import React from "react";

import {
  createStyles,
  makeStyles,
  Grid,
  Chip,
  IconButton,
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/AddCircleOutline";

const snapshotReducer = (accumulator: string, currentValue: any) => {};
const getPrimaryValue = (config: { primaryKeys: string[] }) => {};

const useStyles = makeStyles(theme =>
  createStyles({
    chipList: {
      marginTop: -1,
    },
  })
);
interface Props {
  value: any;
  row: { ref: firebase.firestore.DocumentReference; id: string };
  onSubmit: Function;
  collectionPath: string;
  isScrolling: boolean;
  setSearch: any;
  config: any;
  column: any;
}

const DocSelect = (props: Props) => {
  const classes = useStyles();
  const {
    value,
    row,
    onSubmit,
    collectionPath,
    config,
    setSearch,
    column,
  } = props;
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setSearch((oldValues: any) => ({
      ...oldValues,
      collection: collectionPath,
      config: config,
      onSubmit: (newItem: any) => {
        if (value) onSubmit([...value, newItem]);
        else onSubmit([newItem]);
      },
    }));
  };

  const handleDelete = (index: number) => {
    let newValue = [...value];
    newValue.splice(index, 1);
    onSubmit(newValue);
  };

  return (
    <Grid
      container
      alignItems="center"
      spacing={1}
      className={classes.chipList}
    >
      <Grid item xs>
        <Grid container spacing={1}>
          {value &&
            value.map((doc: any, index: number) => (
              <Grid item key={doc.docPath}>
                <Chip
                  label={config.primaryKeys.map(
                    (key: string) => `${doc.snapshot[key]} `
                  )}
                  onDelete={
                    column.editable ? () => handleDelete(index) : undefined
                  }
                />
              </Grid>
            ))}
        </Grid>
      </Grid>

      {column.editable && (
        <Grid item>
          <IconButton onClick={handleClick} size="small">
            <AddIcon />
          </IconButton>
        </Grid>
      )}
      {/* <Typography>
        {value[0]
          ? config.primaryKeys.map((key: any) => `${value[0].snapshot[key]} `)
          : ""}
      </Typography> */}
    </Grid>
  );
};

export default DocSelect;
