import { makeStyles, createStyles, Grid, Button } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import AddRowIcon from "assets/icons/AddRow";

import { DRAWER_COLLAPSED_WIDTH } from "components/SideDrawer";
import { TABLE_HEADER_HEIGHT } from "../TableHeader";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: `calc(100% - ${DRAWER_COLLAPSED_WIDTH}px)`,
      margin: 0,
      padding: theme.spacing(0, 1.5),
      minHeight: TABLE_HEADER_HEIGHT,

      overflowX: "auto",
      whiteSpace: "nowrap",

      userSelect: "none",
      pointerEvents: "none",

      [theme.breakpoints.down("sm")]: {
        width: "100%",
        paddingRight: theme.spacing(1),
      },
    },

    addRow: { borderRadius: 500 },
    addRowIcon: { fontSize: "26px !important" },

    button: {
      borderRadius: theme.shape.borderRadius,
      height: 32,
    },

    circleButton: {
      width: 32,
      height: 32,
    },
  })
);

export default function TableHeaderSkeleton() {
  const classes = useStyles();

  return (
    <Grid
      container
      alignItems="center"
      spacing={2}
      wrap="nowrap"
      className={classes.root}
    >
      <Grid item>
        <Skeleton variant="rect" className={classes.addRow}>
          <Button
            variant="contained"
            startIcon={<AddRowIcon className={classes.addRowIcon} />}
          >
            Add Row
          </Button>
        </Skeleton>
      </Grid>

      <Grid item />

      <Grid item>
        <Skeleton variant="rect" className={classes.button}>
          <Button variant="contained" startIcon={<AddRowIcon />}>
            Hide
          </Button>
        </Skeleton>
      </Grid>
      <Grid item>
        <Skeleton variant="rect" className={classes.button}>
          <Button variant="contained" startIcon={<AddRowIcon />}>
            Filter
          </Button>
        </Skeleton>
      </Grid>

      <Grid item xs />

      <Grid item>
        <Skeleton
          variant="rect"
          className={classes.button}
          style={{ width: 120 }}
        />
      </Grid>

      <Grid item />

      <Grid item>
        <Skeleton variant="circle" className={classes.circleButton} />
      </Grid>
      <Grid item>
        <Skeleton variant="circle" className={classes.circleButton} />
      </Grid>
      <Grid item>
        <Skeleton variant="circle" className={classes.circleButton} />
      </Grid>
    </Grid>
  );
}
