import React from "react";

import * as yup from "yup";
import { FIELDS } from "@antlerengineering/form-builder";
import HelperText from "../HelperText";

export const settings = () => [
  { type: FIELDS.heading, label: "Cloud Run configuration" },
  {
    type: FIELDS.text,
    name: "ftBuildUrl",
    label: "Cloud Run trigger URL",
  },
];