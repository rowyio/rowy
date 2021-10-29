import { makeStyles, createStyles } from "@mui/styles";
import { Grid } from "@mui/material";

import { IStepProps } from ".";
import Column from "../Column";
import Cell from "../Cell";

import { useProjectContext } from "@src/contexts/ProjectContext";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      minHeight: 300,
      height: "calc(100% - 80px)",
    },

    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      overflow: "scroll",
    },

    spacer: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      flexShrink: 0,
    },

    header: {
      position: "sticky",
      top: 0,
      zIndex: 1,
    },
    data: {
      flexGrow: 1,
    },

    column: {
      width: 200,
      flexShrink: 0,
      marginLeft: -1,

      "&:first-of-type": { marginLeft: 0 },
    },
  })
);

export default function Step4Preview({ config }: IStepProps) {
  const classes = useStyles();
  const { tableState } = useProjectContext();

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Grid container wrap="nowrap" className={classes.header}>
          {Object.entries(config).map(([field, { name, type }]) => (
            <Grid item key={field} className={classes.column}>
              <Column label={name} type={type} />
            </Grid>
          ))}
          <Grid item className={classes.spacer} />
        </Grid>

        <Grid container wrap="nowrap" className={classes.data}>
          {Object.entries(config).map(([field, { name, type }]) => (
            <Grid item key={field} className={classes.column}>
              {tableState!.rows!.slice(0, 20).map((row) => (
                <Cell
                  key={field + row.id}
                  field={field}
                  value={row[field]}
                  type={type}
                  name={name}
                />
              ))}
              <Grid item className={classes.spacer} />
            </Grid>
          ))}
          <Grid item className={classes.spacer} />
        </Grid>
      </div>
    </div>
  );
}
