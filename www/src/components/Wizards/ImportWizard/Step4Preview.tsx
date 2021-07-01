import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";

import { makeStyles, createStyles, Grid } from "@material-ui/core";

import { IStepProps } from ".";
import Column from "../Column";
import Cell from "../Cell";

import { useFiretableContext } from "contexts/FiretableContext";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      position: "relative",

      "&::after": {
        content: '""',
        display: "block",
        pointerEvents: "none",

        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,

        height: theme.spacing(3),
        backgroundImage: `linear-gradient(to top, ${
          theme.palette.background.elevation?.[24] ??
          theme.palette.background.paper
        }, transparent)`,
      },

      "&::before": {
        content: '""',
        display: "block",
        pointerEvents: "none",
        zIndex: 1,

        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,

        width: theme.spacing(3),
        backgroundImage: `linear-gradient(to left, ${
          theme.palette.background.elevation?.[24] ??
          theme.palette.background.paper
        }, transparent)`,
      },
    },

    spacer: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      flexShrink: 0,
    },

    header: { overflowX: "hidden" },
    data: {
      overflow: "scroll",
      height: 300,
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
  const { tableState } = useFiretableContext();

  return (
    <div className={classes.root}>
      <ScrollSync vertical={false} proportional={false}>
        <div>
          <ScrollSyncPane>
            <Grid container wrap="nowrap" className={classes.header}>
              {Object.entries(config).map(([field, { name, type }]) => (
                <Grid item key={field} className={classes.column}>
                  <Column label={name} type={type} />
                </Grid>
              ))}
              <Grid item className={classes.spacer} />
            </Grid>
          </ScrollSyncPane>

          <ScrollSyncPane>
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
          </ScrollSyncPane>
        </div>
      </ScrollSync>
    </div>
  );
}
