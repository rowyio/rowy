import React from "react";
import clsx from "clsx";
import { CustomCellProps } from "./withCustomCell";

import {
  makeStyles,
  createStyles,
  Grid,
  Tooltip,
  Button,
} from "@material-ui/core";

import MultiSelect_ from "@antlerengineering/multiselect";
import FormattedChip, { VARIANTS } from "components/FormattedChip";
import { FieldType } from "constants/fields";
import { useFiretableContext } from "contexts/FiretableContext";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },

    inputBase: {
      height: "100%",
      font: "inherit",
      color: "inherit !important",
      letterSpacing: "inherit",
    },

    select: {
      height: "100%",
      display: "flex",
      alignItems: "center",
      whiteSpace: "pre-line",
      padding: theme.spacing(0, 4, 0, 1.5),
      "&&": { paddingRight: theme.spacing(4) },
    },
    selectSingleLabel: {
      maxHeight: "100%",
      overflow: "hidden",
    },
    icon: { right: theme.spacing(1) },

    chipList: {
      overflowX: "hidden",
      width: "100%",
    },
    chip: { cursor: "inherit" },
    chipLabel: { whiteSpace: "nowrap" },
  })
);

export const ConvertStringToArray = ({ value, onSubmit }) => (
  <>
    {value}
    <Tooltip title="It looks like this is a string, click to convert it to an array">
      <Button
        onClick={() => {
          onSubmit([value]);
        }}
      >
        fix
      </Button>
    </Tooltip>
  </>
);

export default function MultiSelect({
  rowIdx,
  column,
  value,
  onSubmit,
}: CustomCellProps) {
  const classes = useStyles();

  const { config } = column as any;
  const { dataGridRef } = useFiretableContext();

  // Support SingleSelect field
  const isSingle = (column as any).type === FieldType.singleSelect;

  let sanitisedValue: any;
  if (isSingle) {
    if (value === undefined || value === null || value === "")
      sanitisedValue = null;
    else if (Array.isArray(value)) sanitisedValue = value[0];
    else sanitisedValue = value;
  } else {
    if (value === undefined || value === null || value === "")
      sanitisedValue = [];
    else sanitisedValue = value;
  }

  // Render chips or basic string
  const renderValue = isSingle
    ? () =>
        typeof sanitisedValue === "string" &&
        VARIANTS.includes(sanitisedValue.toLowerCase()) ? (
          <FormattedChip label={sanitisedValue} className={classes.chip} />
        ) : (
          <span className={classes.selectSingleLabel}>{sanitisedValue}</span>
        )
    : () => (
        <Grid container spacing={1} wrap="nowrap" className={classes.chipList}>
          {sanitisedValue?.map(
            (item) =>
              typeof item === "string" && (
                <Grid item key={item}>
                  <FormattedChip
                    label={item}
                    className={classes.chip}
                    classes={{ label: classes.chipLabel }}
                  />
                </Grid>
              )
          )}
        </Grid>
      );

  const handleOpen = () => {
    if (dataGridRef?.current?.selectCell)
      dataGridRef.current.selectCell({ rowIdx, idx: column.idx });
  };
  if (typeof value === "string" && value !== "" && !isSingle)
    return <ConvertStringToArray value={value} onSubmit={onSubmit} />;
  return (
    // <Tooltip
    //   title={
    //     value
    //       ? Array.isArray(value)
    //         ? value.length > 1
    //           ? value.join(", ")
    //           : ``
    //         : value
    //       : ``
    //   }
    //   enterDelay={100}
    //   interactive
    //   placement="bottom-start"
    // >
    <div
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <MultiSelect_
        value={sanitisedValue}
        onChange={onSubmit}
        freeText={config.freeText}
        multiple={!isSingle as any}
        label={column.name}
        labelPlural={column.name}
        options={config.options ?? []}
        disabled={column.editable === false}
        onOpen={handleOpen}
        TextFieldProps={
          {
            label: "",
            hiddenLabel: true,
            variant: "standard",
            className: classes.root,
            InputProps: {
              disableUnderline: true,
              classes: { root: classes.inputBase },
            },
            SelectProps: {
              classes: {
                root: clsx(classes.root, classes.select),
                icon: classes.icon,
              },
              renderValue,
              MenuProps: {
                anchorOrigin: { vertical: "bottom", horizontal: "left" },
                transformOrigin: { vertical: "top", horizontal: "left" },
              },
            },
          } as const
        }
      />
    </div>
    //  </Tooltip>
  );
}
