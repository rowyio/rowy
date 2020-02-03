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
      height: "1em",
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
}

const DocSelect = (props: Props) => {
  const { value, row, onSubmit, collectionPath, config, setSearch } = props;
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
    <Grid container alignItems="center" spacing={1}>
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
                    config.isLocked ? () => {} : () => handleDelete(index)
                  }
                />
              </Grid>
            ))}
        </Grid>
      </Grid>

      {!config.isLocked && (
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
