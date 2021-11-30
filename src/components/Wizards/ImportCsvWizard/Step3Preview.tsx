import _find from "lodash/find";
import { parseJSON } from "date-fns";

import { makeStyles, createStyles } from "@mui/styles";
import { Grid } from "@mui/material";

import { IStepProps } from ".";
import Column from "../Column";
import Cell from "../Cell";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { FieldType } from "@src/constants/fields";

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

export default function Step4Preview({ csvData, config }: IStepProps) {
  const classes = useStyles();
  const { tableState } = useProjectContext();

  if (!tableState) return null;

  const columns = config.pairs.map(({ csvKey, columnKey }) => ({
    csvKey,
    columnKey,
    ...(tableState!.columns[columnKey] ??
      _find(config.newColumns, { key: columnKey }) ??
      {}),
  }));

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Grid container wrap="nowrap" className={classes.header}>
          {columns.map(({ key, name, type }) => (
            <Grid item key={key} className={classes.column}>
              <Column label={name} type={type} />
            </Grid>
          ))}
          <Grid item className={classes.spacer} />
        </Grid>

        <Grid container wrap="nowrap" className={classes.data}>
          {columns.map(({ csvKey, name, columnKey, type }) => (
            <Grid item key={csvKey} className={classes.column}>
              {csvData.rows.slice(0, 50).map((row, i) => (
                <Cell
                  key={csvKey + i}
                  field={columnKey}
                  value={
                    type === FieldType.date || type === FieldType.dateTime
                      ? parseJSON(row[columnKey])
                      : row[columnKey]
                  }
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
