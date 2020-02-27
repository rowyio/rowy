import React, { useState } from "react";
import clsx from "clsx";

import {
  TextField,
  Chip,
  Grid,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Portal,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import SelectedIcon from "@material-ui/icons/Check";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import AddIcon from "@material-ui/icons/Add";

import useStyles from "./styles";
import { IMultiSelectProps, OptionType } from ".";

export interface IPopupContentsProps
  extends Omit<
    IMultiSelectProps,
    "options" | "label" | "className" | "TextFieldProps"
  > {
  options: OptionType[];

  dropdownWidth: number;
  setDropdownWidth: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * The contents of the popup of the MultiSelect dropdown.
 * Broken out into separate component since the effects and functions here
 * are quite heavy, so they will only be mounted/executed when the dropdown
 * is open.
 */
export default function PopupContents({
  onChange,
  value = [],
  searchable = false,
  itemRenderer,
  freeText = false,
  multiple = true,
  selectAll = true,

  options,

  dropdownWidth,
  setDropdownWidth,
}: IPopupContentsProps) {
  const classes = useStyles({
    searchable,
    freeText,
    multiple,
    width: dropdownWidth,
  });

  const [filterState, setFilterState] = useState("");
  const select = option => {
    if (multiple) onChange([...value, option.value]);
    else onChange([option.value]);
  };
  const deselect = (option: { label: string; value: string }) => {
    if (multiple) onChange(value?.filter(v => v !== option.value));
    else onChange([]);
  };

  const handleSelectAll = () => onChange(options.map(o => o.value));
  const clearSelection = () => onChange([]);

  // `freeText`: Handle custom field
  const [customField, setCustomField] = useState("");
  const handleAddCustom = () => {
    setCustomField("");
    // Prevent duplicate being added
    if (value.includes(customField)) return;
    select({ value: customField, label: customField });
  };

  // Get longest item label
  const longestLabel = options.reduce(
    (acc, curr) => (curr.label?.length > acc.length ? curr.label : acc),
    ""
  );

  return (
    <Grid container direction="column">
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
                option.label.toUpperCase().includes(filterState.toUpperCase())
              );
            })
            .map(option => {
              const isSelected = value?.includes(option.value);

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
                    key={`select-chip-${option.value}`}
                    className={clsx(
                      classes.chip,
                      isSelected && classes.selectedChip
                    )}
                    onClick={e => {
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
              {value?.length} of {options.length}
            </Typography>
            <Button
              disabled={selectAll === false && value?.length === 0}
              onClick={
                value?.length === options.length || !selectAll
                  ? clearSelection
                  : handleSelectAll
              }
              color="primary"
              className={classes.selectAllButton}
            >
              {value?.length === options.length || !selectAll
                ? "Clear Selection"
                : "Select All"}
            </Button>
          </Grid>
        </Grid>
      )}

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
    </Grid>
  );
}
