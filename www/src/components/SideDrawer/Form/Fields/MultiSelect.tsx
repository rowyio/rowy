import React, { useState } from "react";
import clsx from "clsx";
import _unionWith from "lodash/unionWith";
import { FieldProps } from "formik";

import {
  createStyles,
  makeStyles,
  TextField,
  Chip,
  Grid,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Portal,
} from "@material-ui/core";
import { FilledTextFieldProps } from "@material-ui/core/TextField";

import SearchIcon from "@material-ui/icons/Search";
import SelectedIcon from "@material-ui/icons/Check";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import AddIcon from "@material-ui/icons/Add";

interface StylesProps {
  searchable: boolean;
  freeText: boolean;
  multiple: boolean;
  width?: number;
}

const useStyles = makeStyles(theme =>
  createStyles({
    root: { minWidth: 200 },
    selectRoot: { paddingRight: theme.spacing(4) },

    paper: { overflow: "hidden", maxHeight: "calc(100% - 48px)" },
    menuChild: {
      padding: `0 ${theme.spacing(2)}px`,
      width: ({ width }: StylesProps) => width || 480,
      maxWidth: `calc(100vw - ${theme.spacing(4)}px)`,
    },
    grid: { outline: 0 },

    noMargins: { margin: 0 },

    searchRow: { marginTop: theme.spacing(2) },

    chipListRow: {
      background: `${theme.palette.background.paper} no-repeat`,
      backgroundImage:
        "linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0)), linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))",
      backgroundPosition: `-12px 0, -24px 100%`,
      backgroundSize: `calc(100% + 12px + 12px) 16px`,

      position: "relative",

      "&::before, &::after": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9,

        display: "block",
        height: 16,

        background: `linear-gradient(to bottom, #fff, rgba(255, 255, 255, 0))`,
      },

      "&::after": {
        top: "auto",
        bottom: 0,
        background: `linear-gradient(to top, #fff, rgba(255, 255, 255, 0))`,
      },
    },
    chipList: ({ searchable, freeText, multiple }: StylesProps) => {
      let maxHeightDeductions = 0;
      if (searchable) maxHeightDeductions -= 64;
      if (multiple) maxHeightDeductions -= 48;
      if (freeText) maxHeightDeductions -= 48;
      if (freeText && !multiple) maxHeightDeductions -= theme.spacing(2);

      return {
        margin: `0px -${theme.spacing(2)}px`,
        padding: `12px ${theme.spacing(2) - theme.spacing(0.5)}px`,
        overflowY: "auto" as "auto",
        maxHeight: `calc(100vh - 48px - ${-maxHeightDeductions}px)`,
      };
    },
    chip: {
      margin: theme.spacing(0.5),
      // Allow multi-line chip
      maxWidth: `calc(100% - ${theme.spacing(1)}px)`,
    },
    selectedChip: { backgroundColor: theme.palette.divider },

    footerRow: { marginBottom: theme.spacing(2) },
    addCustomButton: { marginLeft: -theme.spacing(1) },
    selectedRow: {
      "$chipListRow + &": { marginTop: -theme.spacing(1) },
      "$footerRow + &": { marginTop: -theme.spacing(2) },

      marginBottom: 0,
      "& > div": { height: 48 },
    },
    selectAllButton: { marginRight: -theme.spacing(1) },
    selectedNum: { fontFeatureSettings: '"tnum"' },

    measureChip: {
      visibility: "hidden",
      position: "absolute",
      top: 0,
      left: 0,
    },
  })
);

type OptionType = { label: string; value: string; data?: any };

export interface IMultiSelectProps extends FieldProps<string[]> {
  label: string;
  /** The list of options to display. Passing `string[]` will auto-transform */
  options: OptionType[] | string[];
  itemRenderer?: (
    option: OptionType,
    select: Function,
    deselect: Function,
    isSelected: Boolean
  ) => React.ReactNode;
  searchable?: boolean;

  /** Optionally allow the user to select all options */
  selectAll?: boolean;
  /** Optionally allow the user to add a custom option */
  freeText?: boolean;
  /** Optionally set this prop to `false` to only allow one option */
  multiple?: boolean;
  /** Optional style overrides for root MUI `TextField` component */
  className?: string;
  /** Override any props of the root MUI `TextField` component */
  TextFieldProps?: Partial<FilledTextFieldProps>;
}

export default function MultiSelect({
  field,
  form,
  options: optionsProp,
  searchable = false,
  itemRenderer,
  freeText = true,
  multiple = true,
  selectAll = true,
  className,
  TextFieldProps = {},
}: IMultiSelectProps) {
  const [dropdownWidth, setDropdownWidth] = useState(200);
  const classes = useStyles({
    searchable,
    freeText,
    multiple,
    width: dropdownWidth,
  });

  const [filterState, setFilterState] = useState("");
  const select = (option: OptionType) => {
    if (multiple && field.value)
      form.setFieldValue(field.name, [...field.value, option.value]);
    else form.setFieldValue(field.name, [option.value]);
  };
  const deselect = (option: { label: string; value: string }) => {
    if (multiple)
      form.setFieldValue(
        field.name,
        field.value?.filter((v: string) => v !== option.value) ?? []
      );
    else form.setFieldValue(field.name, []);
  };

  // Transform `option` prop if it’s just strings
  let options =
    typeof optionsProp[0] === "string"
      ? (optionsProp as string[]).map(
          item => ({ label: item, value: item } as OptionType)
        )
      : (optionsProp as OptionType[]);
  // If `freeText` enabled, show the user’s custom fields
  if (freeText) {
    // `value` prop is an array of all values. It removes labels
    const formattedValues =
      field.value?.map((x: string) => ({
        label: x,
        value: x,
      })) ?? [];
    options = _unionWith(
      options,
      formattedValues,
      (a, b) => a.value === b.value
    );
  }

  const handleSelectAll = () =>
    form.setFieldValue(
      field.name,
      options.map(o => o.value)
    );
  const clearSelection = () => form.setFieldValue(field.name, []);

  // `freeText`: Handle custom field
  const [customField, setCustomField] = useState("");
  const handleAddCustom = () => {
    select({ value: customField, label: customField });
    setCustomField("");
  };

  // Get longest item label
  const longestLabel = options.reduce(
    (acc, curr) => (curr.label.length > acc.length ? curr.label : acc),
    ""
  );

  return (
    <>
      <TextField
        name={field.name}
        value={field.value ?? []}
        label=""
        hiddenLabel
        id={`sidedrawer-field-${field.name}`}
        variant="filled"
        fullWidth
        select
        className={clsx(classes.root, className)}
        error={!!(form.touched[field.name] && form.errors[field.name])}
        helperText={(form.touched[field.name] && form.errors[field.name]) || ""}
        {...TextFieldProps}
        SelectProps={{
          renderValue: value => {
            const selected = value as string[];
            if (selected.length === 1 && typeof selected[0] === "string")
              return selected;
            return `${selected.length} of ${options.length} selected`;
          },
          classes: { root: classes.selectRoot },
          ...TextFieldProps.SelectProps,
          // Must have this set to prevent MUI transforming `value`
          // prop for this component to a comma-separated string
          multiple: true,
          MenuProps: {
            classes: { paper: classes.paper, list: classes.menuChild },
            MenuListProps: { disablePadding: true },
            getContentAnchorEl: null,
            anchorOrigin: { vertical: "bottom", horizontal: "center" },
            transformOrigin: { vertical: "top", horizontal: "center" },
          },
        }}
        ref={el => {
          if (!el) return;
          const width = el.getBoundingClientRect().width;
          if (dropdownWidth < width) setDropdownWidth(width);
        }}
        onBlur={() => form.setFieldTouched(field.name)}
      >
        <Grid container direction="column" className={classes.grid}>
          {searchable && (
            <Grid item className={classes.searchRow}>
              <TextField
                value={filterState}
                onChange={e => setFilterState(e.target.value)}
                fullWidth
                variant="filled"
                margin="dense"
                label="Search items"
                className={classes.noMargins}
                InputProps={{
                  //disableUnderline: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onClick={e => e.stopPropagation()}
                onKeyDown={e => e.stopPropagation()}
              />
            </Grid>
          )}

          <Grid item xs className={classes.chipListRow}>
            <ul className={classes.chipList}>
              {options
                .filter(option => {
                  return (
                    filterState === "" ||
                    option.label
                      .toUpperCase()
                      .includes(filterState.toUpperCase())
                  );
                })
                .map(option => {
                  const isSelected = field.value?.includes(option.value);

                  let icon = <></>;
                  if (multiple) {
                    if (isSelected) icon = <SelectedIcon />;
                  } else {
                    if (isSelected) icon = <RadioButtonCheckedIcon />;
                    else icon = <RadioButtonUncheckedIcon />;
                  }

                  if (itemRenderer)
                    return itemRenderer(option, select, deselect, isSelected);
                  else
                    return (
                      <Chip
                        key={`select-chip-${field.name}-${option.value}`}
                        className={clsx(
                          classes.chip,
                          isSelected && classes.selectedChip
                        )}
                        onClick={(e: any) => {
                          e.stopPropagation();
                          if (isSelected) deselect(option);
                          else select(option);
                        }}
                        icon={icon}
                        label={option.label}
                        variant="outlined"
                        component="li"
                        size="medium"
                      />
                    );
                })}
            </ul>
          </Grid>

          {freeText && (
            <Grid item className={classes.footerRow}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <IconButton
                    onClick={handleAddCustom}
                    className={classes.addCustomButton}
                  >
                    <AddIcon />
                  </IconButton>
                </Grid>
                <Grid item xs>
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Add new item"
                    margin="dense"
                    className={classes.noMargins}
                    value={customField}
                    onChange={e => setCustomField(e.target.value)}
                    onKeyPress={e => {
                      if (e.key === "Enter") handleAddCustom();
                    }}
                    onKeyDown={e => e.stopPropagation()}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}

          {multiple && (
            <Grid item className={clsx(classes.footerRow, classes.selectedRow)}>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
              >
                <Typography
                  variant="button"
                  color="textSecondary"
                  className={classes.selectedNum}
                >
                  {field.value?.length} of {options.length}
                </Typography>
                <Button
                  disabled={selectAll === false && field.value?.length === 0}
                  onClick={
                    field.value?.length === options.length || !selectAll
                      ? clearSelection
                      : handleSelectAll
                  }
                  color="primary"
                  className={classes.selectAllButton}
                >
                  {field.value?.length === options.length || !selectAll
                    ? "Clear Selection"
                    : "Select All"}
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>
      </TextField>

      <Portal>
        <Chip
          className={clsx(classes.chip, classes.measureChip)}
          icon={<SelectedIcon />}
          label={longestLabel}
          variant="outlined"
          role="presentation"
          ref={el => {
            if (!el) return;
            const width = el.getBoundingClientRect().width;
            if (dropdownWidth < width) setDropdownWidth(width + 32);
          }}
        />
      </Portal>
    </>
  );
}
