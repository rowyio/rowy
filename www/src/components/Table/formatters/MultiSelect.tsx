import React from "react";
import clsx from "clsx";
import { CustomCellProps } from "./withCustomCell";

import { makeStyles, createStyles, Grid } from "@material-ui/core";

import MultiSelect_ from "components/MultiSelect";
import FormattedChip from "components/FormattedChip";
import { FieldType } from "constants/fields";
import { useFiretableContext } from "contexts/firetableContext";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      minWidth: 0,

      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
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
    },
    icon: { marginRight: theme.spacing(1) },

    chipList: {
      overflowX: "hidden",
      width: "100%",
    },
    chip: { cursor: "inherit" },
  })
);

export default function MultiSelect({
  rowIdx,
  column,
  value,
  onSubmit,
}: CustomCellProps) {
  const classes = useStyles();

  const { options } = column as any;
  const { dataGridRef } = useFiretableContext();

  // Support SingleSelect field
  const isSingle = (column as any).type === FieldType.singleSelect;

  // If SingleSelect, transform string to array of strings
  const transformedValue = isSingle
    ? (([value] as unknown) as string[])
    : value;
  // And support transforming array of strings back to string
  const handleChange = value => onSubmit(isSingle ? value.join(", ") : value);

  // Render chips
  const renderValue = value => (
    <Grid container spacing={1} wrap="nowrap" className={classes.chipList}>
      {value?.map(
        item =>
          typeof item === "string" && (
            <Grid item key={item}>
              <FormattedChip label={item} className={classes.chip} />
            </Grid>
          )
      )}
    </Grid>
  );

  const onClick = e => e.stopPropagation();
  const onClose = () => {
    if (dataGridRef?.current?.selectCell)
      dataGridRef.current.selectCell({ rowIdx, idx: column.idx });
  };

  return (
    <MultiSelect_
      value={transformedValue}
      onChange={handleChange}
      label={column.name}
      options={options}
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
            icon: classes.icon,
          },
          renderValue,
          MenuProps: {
            anchorOrigin: { vertical: "bottom", horizontal: "left" },
            transformOrigin: { vertical: "top", horizontal: "left" },
          },
        },
        onClick,
      }}
      freeText
      className={clsx(classes.fullHeight, classes.root)}
      multiple={!isSingle}
    />
  );
}
