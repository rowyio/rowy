import { makeStyles, createStyles, Button } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import AddColumnIcon from "assets/icons/AddColumn";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
    },
    cell: {
      backgroundColor: theme.palette.background.default,
      border: `1px solid #e0e0e0`,
      borderLeftWidth: 0,

      width: 150,
      height: 44,
    },

    addColumn: {
      borderRadius: 500,
      height: 32,
      marginLeft: -46 + 12,
    },
    addColumnIcon: { fontSize: "24px !important" },
  })
);

const NUM_CELLS = 5;

export default function HeaderRowSkeleton() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {new Array(NUM_CELLS).fill(undefined).map((_, i) => (
        <Skeleton key={i} variant="rect" className={classes.cell} />
      ))}

      <Skeleton variant="rect" className={classes.cell} style={{ width: 46 }} />

      <Skeleton variant="rect" className={classes.addColumn}>
        <Button
          variant="contained"
          startIcon={<AddColumnIcon className={classes.addColumnIcon} />}
        >
          Add Column
        </Button>
      </Skeleton>
    </div>
  );
}
