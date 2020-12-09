import React from "react";
import clsx from "clsx";
import { CustomCellProps } from "./withCustomCell";

import { createStyles, makeStyles, Grid, Chip } from "@material-ui/core";

import ConnectTableSelect from "components/ConnectTableSelect";
import { useFiretableContext } from "contexts/FiretableContext";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      minWidth: 0,

      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
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

export default function ConnectTable({
  rowIdx,
  column,
  value,
  onSubmit,
  row,
}: CustomCellProps) {
  const classes = useStyles();

  const { collectionPath, config } = column as any;
  const { dataGridRef } = useFiretableContext();
  if (!config || !config.primaryKeys) return <></>;
  const disabled = column.editable === false || config?.isLocked;

  // Render chips
  const renderValue = () => (
    <Grid container spacing={1} wrap="nowrap" className={classes.chipList}>
      {Array.isArray(value) &&
        value.map((doc: any) => (
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

  const onClick = (e) => e.stopPropagation();
  const onClose = () => {
    if (dataGridRef?.current?.selectCell)
      dataGridRef.current.selectCell({ rowIdx, idx: column.idx });
  };

  return (
    <ConnectTableSelect
      row={row}
      column={column}
      value={value}
      onChange={onSubmit}
      collectionPath={collectionPath}
      config={config}
      editable={column.editable as boolean}
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
          onClose,
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
        onClick,
      }}
      className={clsx(
        classes.fullHeight,
        classes.root,
        disabled && classes.disabled
      )}
    />
  );
}
