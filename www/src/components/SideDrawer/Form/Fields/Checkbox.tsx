import React from "react";

import { CheckboxWithLabel, CheckboxWithLabelProps } from "formik-material-ui";
import ErrorMessage from "../ErrorMessage";

export interface ICheckboxProps extends CheckboxWithLabelProps {
  label: React.ReactNode;
}

export default function Checkbox({ label, ...props }: ICheckboxProps) {
  return (
    <>
      <CheckboxWithLabel
        Label={{ label, style: { width: "100%" } }}
        {...props}
        type="checkbox"
      />
      <ErrorMessage name={props.field.name} />
    </>
  );
}
