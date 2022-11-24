import { Suspense } from "react";
import clsx from "clsx";
import { ErrorBoundary } from "react-error-boundary";

import { TextField, TextFieldProps } from "@mui/material";

import ErrorFallback from "@src/components/ErrorFallback";
import useStyles from "./styles";
import Loading from "@src/components/Loading";
import PopupContents from "./PopupContents";
import { TableRowRef } from "@src/types/table";

export type ServiceValue = {
  value: string;
  [prop: string]: any;
};

export interface IConnectorSelectProps {
  value: ServiceValue[];
  onChange: (value: ServiceValue[]) => void;
  column: any;
  editable?: boolean;
  /** Optional style overrides for root MUI `TextField` component */
  className?: string;
  /** Override any props of the root MUI `TextField` component */
  TextFieldProps?: Partial<TextFieldProps>;
  _rowy_ref: TableRowRef;
  disabled?: boolean;
}

export default function ConnectorSelect({
  value = [],
  className,
  TextFieldProps = {},
  disabled,
  ...props
}: IConnectorSelectProps) {
  const { classes } = useStyles();

  const sanitisedValue = Array.isArray(value) ? value : [];
  return (
    <TextField
      label=""
      hiddenLabel
      variant={"filled" as any}
      select
      value={sanitisedValue}
      className={clsx(classes.root, className)}
      {...TextFieldProps}
      SelectProps={{
        renderValue: (value) => `${(value as any[]).length} selected`,
        displayEmpty: true,
        classes: { select: classes.selectRoot },
        ...TextFieldProps.SelectProps,
        // Must have this set to prevent MUI transforming `value`
        // prop for this component to a comma-separated string
        MenuProps: {
          classes: { paper: classes.paper, list: classes.menuChild },
          MenuListProps: {
            disablePadding: true,
            style: { padding: 0 },
            component: "div",
          } as any,
          anchorOrigin: { vertical: "bottom", horizontal: "center" },
          transformOrigin: { vertical: "top", horizontal: "center" },
          ...TextFieldProps.SelectProps?.MenuProps,
        },
      }}
      disabled={disabled}
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<Loading />}>
          <PopupContents value={sanitisedValue} {...props} />
        </Suspense>
      </ErrorBoundary>
    </TextField>
  );
}
