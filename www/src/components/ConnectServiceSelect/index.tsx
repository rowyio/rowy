import { lazy, Suspense } from "react";
import clsx from "clsx";

import { TextField, TextFieldProps } from "@material-ui/core";
import useStyles from "./styles";
import Loading from "components/Loading";
import ErrorBoundary from "components/ErrorBoundary";

const PopupContents = lazy(
  () => import("./PopupContents" /* webpackChunkName: "PopupContents" */)
);

export type ServiceValue = { value: string; [prop: string]: any };

export interface IConnectServiceSelectProps {
  value: ServiceValue[];
  onChange: (value: ServiceValue[]) => void;
  row: any;
  config: {
    displayKey: string;
    [key: string]: any;
  };
  editable?: boolean;
  /** Optional style overrides for root MUI `TextField` component */
  className?: string;
  /** Override any props of the root MUI `TextField` component */
  TextFieldProps?: Partial<TextFieldProps>;
  docRef: firebase.default.firestore.DocumentReference;
}

export default function ConnectServiceSelect({
  value = [],
  className,
  TextFieldProps = {},
  ...props
}: IConnectServiceSelectProps) {
  const classes = useStyles();

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
        classes: { root: classes.selectRoot },
        ...TextFieldProps.SelectProps,
        // Must have this set to prevent MUI transforming `value`
        // prop for this component to a comma-separated string
        MenuProps: {
          classes: { paper: classes.paper, list: classes.menuChild },
          MenuListProps: { disablePadding: true },
          getContentAnchorEl: null,
          anchorOrigin: { vertical: "bottom", horizontal: "center" },
          transformOrigin: { vertical: "top", horizontal: "center" },
          ...TextFieldProps.SelectProps?.MenuProps,
        },
      }}
    >
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <PopupContents value={sanitisedValue} {...props} />
        </Suspense>
      </ErrorBoundary>
    </TextField>
  );
}
