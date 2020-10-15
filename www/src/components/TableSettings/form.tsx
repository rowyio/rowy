import React from "react";

import * as yup from "yup";
import { FIELDS } from "@antlerengineering/form-builder";
import { TableSettingsDialogModes } from "./index";

import HelperText from "./HelperText";
import { Link } from "@material-ui/core";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import { MONO_FONT } from "Theme";

export const tableSettings = (
  mode: TableSettingsDialogModes | null,
  roles: string[] | undefined,
  sections: string[] | undefined
) => [
  {
    type: FIELDS.text,
    name: "name",
    label: "Table Name*",
    validation: yup.string().required("Required"),
  },

  {
    type: FIELDS.text,
    name: "collection",
    label: "Collection Name*",
    validation: yup.string().required("Required"),
  },
  {
    type: FIELDS.description,
    description: (
      <HelperText>
        <Link
          href={`https://console.firebase.google.com/project/${process.env.REACT_APP_FIREBASE_PROJECT_ID}/firestore/data`}
          target="_blank"
          rel="noopener"
        >
          View your Firestore collections
          <OpenInNewIcon
            aria-label="Open in new tab"
            fontSize="small"
            style={{ verticalAlign: "bottom", marginLeft: 4 }}
          />
        </Link>
      </HelperText>
    ),
  },

  {
    type: FIELDS.singleSelect,
    name: "tableType",
    label: "Table Type*",
    defaultValue: "primaryCollection",
    options: [
      { label: "Primary Collection", value: "primaryCollection" },
      { label: "Collection Group", value: "collectionGroup" },
    ],
    validation: yup.string().required("Required"),
    disabled: mode === TableSettingsDialogModes.update,
  },
  (values) => ({
    type: FIELDS.description,
    description:
      values.tableType === "primaryCollection" ? (
        <HelperText>
          Connect this table to the collection named “
          <span style={{ fontFamily: MONO_FONT }}>{values.collection}</span>”
        </HelperText>
      ) : (
        <HelperText>
          Connect this table to all collections and subcollections named “
          <span style={{ fontFamily: MONO_FONT }}>{values.collection}</span>”
          <Link
            href="https://firebase.googleblog.com/2019/06/understanding-collection-group-queries.html"
            target="_blank"
            rel="noopener"
            display="block"
          >
            Learn more about collection groups
            <OpenInNewIcon
              aria-label="Open in new tab"
              fontSize="small"
              style={{ verticalAlign: "bottom", marginLeft: 4 }}
            />
          </Link>
        </HelperText>
      ),
  }),

  {
    type: FIELDS.multiSelect,
    name: "section",
    multiple: false,
    label: "Section*",
    freeText: true,
    options: sections,
    validation: yup.string().required("Required"),
  },
  {
    type: FIELDS.text,
    name: "copySchema",
    label: "Copy Schema",
  },
  {
    type: FIELDS.text,
    name: "description",
    label: "Description",
    fieldVariant: "long",
    validation: yup.string(),
  },

  {
    type: FIELDS.multiSelect,
    name: "roles",
    label: "Accessed By*",
    options: roles,
    validation: yup.array().of(yup.string()).required("Required"),
    freeText: true,
  },
  (values) => ({
    type: FIELDS.description,
    description: (
      <HelperText>
        Choose which users have access to this table. Remember to set the
        appropriate Firestore Security Rules for the “
        <span style={{ fontFamily: MONO_FONT }}>{values.collection}</span>”
        collection.
        <Link
          href="https://github.com/AntlerVC/firetable/wiki/Role-Based-Security-Rules"
          target="_blank"
          rel="noopener"
          display="block"
        >
          Read about role-based security rules
          <OpenInNewIcon
            aria-label="Open in new tab"
            fontSize="small"
            style={{ verticalAlign: "bottom", marginLeft: 4 }}
          />
        </Link>
      </HelperText>
    ),
  }),
];
