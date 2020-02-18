import React from "react";
import { FieldProps } from "formik";

import _RichText from "components/RichText";
import ErrorMessage from "../ErrorMessage";

export default function RichText({ form, field }: FieldProps) {
  const handleChange = value => form.setFieldValue(field.name, value);

  return (
    <>
      <_RichText value={field.value} onChange={handleChange} />
      <ErrorMessage name={field.name} />
    </>
  );
}
