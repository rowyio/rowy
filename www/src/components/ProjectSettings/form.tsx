import React from "react";

import * as yup from "yup";
import { FIELDS } from "@antlerengineering/form-builder";
import HelperText from "../HelperText";

export const settings = () => [
  { type: FIELDS.heading, label: "Cloud build configuration" },
  {
    type: FIELDS.text,
    name: "cloudBuild.branch",
    label: "FT Branch",
    //validation: yup.string().required("Required"),
  },
  {
    type: FIELDS.description,
    description: (
      <HelperText>Firetable branch to build cloud functions from</HelperText>
    ),
  },
  {
    type: FIELDS.text,
    name: "cloudBuild.triggerId",
    label: "Trigger Id",
    //validation: yup.string().required("Required"),
  },
];
