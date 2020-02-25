import React from "react";
import clsx from "clsx";
import withCustomCell, { CustomCellProps } from "./withCustomCell";

import { createStyles, makeStyles, Grid, Chip } from "@material-ui/core";

import ConnectTableSelect from "components/ConnectTableSelect";
import { useFiretableContext } from "contexts/firetableContext";

const useStyles = makeStyles(theme =>
  createStyles({
    root: { minWidth: 0 },
    disabled: {},

    fullHeight: {
      height: "100%",
      font: "inherit",
      color: "inherit",
      letterSpacing: "inherit",
    },

    select: {
      padding: theme.spacing(0, 3, 0, 1.5),
      display: "flex",
      alignItems: "center",

      "&&": { paddingRight: theme.spacing(4) },

      "$disabled &": { paddingRight: theme.spacing(0) },
    },
    icon: {
      marginRight: theme.spacing(1),
      "$disabled &": { display: "none" },
    },

    chipList: {
      overflowX: "hidden",
      width: "100%",
    },
    chip: { cursor: "inherit" },
  })
);

const ConnectTable = ({ rowIdx, column, value, onSubmit }: CustomCellProps) => {
  const classes = useStyles();

  const { collectionPath, config } = column as any;
  const { setSelectedCell } = useFiretableContext();

  const disabled = !column.editable || config.isLocked;

  // Render chips
  const renderValue = value => (
    <Grid container spacing={1} wrap="nowrap" className={classes.chipList}>
      {value?.map((doc: any, index) => (
        <Grid item key={doc.docPath}>
          <Chip
            label={config.primaryKeys
              .map((key: string) => doc.snapshot[key])
              .join(" ")}
            className={classes.chip}
          />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <ConnectTableSelect
      value={value}
      onChange={onSubmit}
      collectionPath={collectionPath}
      config={config}
      TextFieldProps={{
        fullWidth: true,
        label: "",
        hiddenLabel: true,
        variant: "standard" as "filled",
        InputProps: {
          disableUnderline: true,
          classes: { root: classes.fullHeight },
        },
        SelectProps: {
          classes: {
            root: clsx(classes.fullHeight, classes.select),
            icon: clsx(classes.icon),
          },
          renderValue,
          MenuProps: {
            anchorOrigin: { vertical: "bottom", horizontal: "left" },
            transformOrigin: { vertical: "top", horizontal: "left" },
          },
        },
        onClick: e => {
          setSelectedCell!({ row: rowIdx, column: column.key });
          e.stopPropagation();
        },
        disabled,
      }}
      className={clsx(
        "cell-collapse-padding",
        classes.fullHeight,
        classes.root,
        disabled && classes.disabled
      )}
    />
  );
};

export default withCustomCell(ConnectTable);
