import React, { useState, useEffect } from "react";
import { FieldType } from "constants/fields";
import MultiSelect from "@antlerengineering/multiselect";
import { db } from "../firebase";
import { useFiretableContext } from "contexts/firetableContext";
const RolesSelector = ({
  value,
  handleChange,
  label,
}: {
  value?: string[];
  handleChange: any;
  label?: string;
}) => {
  const { roles } = useFiretableContext();
  if (!roles) return <></>;
  return (
    <MultiSelect
      label={label}
      onChange={handleChange}
      value={value ?? []}
      options={roles}
      freeText
    />
  );
};

export default RolesSelector;
