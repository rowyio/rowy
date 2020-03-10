import React, { useState } from "react";
import clsx from "clsx";
import _unionWith from "lodash/unionWith";

import { TextField, TextFieldProps } from "@material-ui/core";

import useStyles from "./styles";
import PopupContents from "./PopupContents";

export type OptionType = { label: string; value: string; data?: any };

export interface IMultiSelectProps {
  label: string;
  value: string[];
  /** The list of options to display. Passing `string[]` will auto-transform */
  options: OptionType[] | string[];
  itemRenderer?: (
    option: OptionType,
    select: Function,
    deselect: Function,
    isSelected: Boolean
  ) => React.ReactNode;
  searchable?: boolean;
  onChange: (value: string[]) => void;

  /** Optionally allow the user to select all options */
  selectAll?: boolean;
  /** Optionally allow the user to add a custom option */
  freeText?: boolean;
  /** Optionally set this prop to `false` to only allow one option */
  multiple?: boolean;
  /** Optional style overrides for root MUI `TextField` component */
  className?: string;
  /** Override any props of the root MUI `TextField` component */
  TextFieldProps?: Partial<TextFieldProps>;
}

export default function MultiSelect({
  options: optionsProp,
  label,
  className,
  TextFieldProps = {},
  ...props
}: IMultiSelectProps) {
  const {
    value = [],
    searchable = true,
    freeText = false,
    multiple = true,
  } = props;

  const [dropdownWidth, setDropdownWidth] = useState(200);
  const classes = useStyles({
    searchable,
    freeText,
    multiple,
    width: dropdownWidth,
  });

  const sanitisedValue = value.filter(v => v?.length > 0);

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
    const formattedValues = sanitisedValue?.map(x => ({ label: x, value: x }));
    options = _unionWith(
      options,
      formattedValues,
      (a, b) => a.value === b.value
    );
  }
  return (
    <TextField
      label={label}
      variant={"filled" as any}
      select
      value={sanitisedValue}
      className={clsx(classes.root, className)}
      {...TextFieldProps}
      SelectProps={{
        renderValue: value => {
          const selected = value as string[];
          if (selected.length === 1 && typeof selected[0] === "string")
            return selected;
          return `${selected.length} of ${options.length} selected`;
        },
        displayEmpty: true,
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
          ...TextFieldProps.SelectProps?.MenuProps,
        },
      }}
      ref={el => {
        if (!el) return;
        const width = el.getBoundingClientRect().width;
        if (dropdownWidth < width) setDropdownWidth(width);
      }}
    >
      <div className={classes.popupContentsWrapper}>
        <PopupContents
          {...props}
          options={options}
          dropdownWidth={dropdownWidth}
          setDropdownWidth={setDropdownWidth}
        />
      </div>
    </TextField>
  );
}
