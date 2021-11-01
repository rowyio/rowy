import { Field, FieldType } from "@rowy/form-builder";
import { TableSettingsDialogModes } from "./index";

import { Link, Typography } from "@mui/material";
import OpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import WarningIcon from "@mui/icons-material/WarningAmber";

import { WIKI_LINKS } from "@src/constants/externalLinks";
import { name } from "@root/package.json";
import { FieldType as TableFieldType } from "@src/constants/fields";

export const tableSettings = (
  mode: TableSettingsDialogModes | null,
  roles: string[] | undefined,
  sections: string[] | undefined,
  tables:
    | { label: string; value: any; section: string; collection: string }[]
    | undefined,
  collections: string[]
): Field[] =>
  [
    {
      type: FieldType.shortText,
      name: "name",
      label: "Table name",
      required: true,
      assistiveText: "User-facing name for this table",
      autoFocus: true,
      gridCols: { xs: 12, sm: 6 },
    },
    {
      type: "camelCaseId",
      name: "id",
      label: "Table ID",
      required: true,
      watchedField: "name",
      assistiveText: `Unique ID for this table used to store configuration. Cannot be edited${
        mode === TableSettingsDialogModes.create ? " later" : ""
      }.`,
      disabled: mode === TableSettingsDialogModes.update,
      gridCols: { xs: 12, sm: 6 },
    },
    {
      type: FieldType.singleSelect,
      name: "collection",
      label: "Collection",
      labelPlural: "collections",
      options: collections,
      itemRenderer: (option) => <code key={option.value}>{option.label}</code>,
      freeText: true,
      required: true,
      assistiveText: (
        <>
          {mode === TableSettingsDialogModes.update ? (
            <>
              <WarningIcon
                color="warning"
                aria-label="Warning"
                sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }}
              />
              You change which Firestore collection to display. Data in the new
              collection must be compatible with the existing columns.
            </>
          ) : (
            "Choose which Firestore collection to display."
          )}{" "}
          <Link
            href={`https://console.firebase.google.com/project/_/firestore/data`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Your collections
            <OpenInNewIcon />
          </Link>
        </>
      ),
      AddButtonProps: { children: "Add collection…" },
      AddDialogProps: {
        title: "Add collection",
        textFieldLabel: (
          <>
            Collection name
            <Typography variant="caption" display="block">
              (Collection won’t be created until you add a row)
            </Typography>
          </>
        ),
      },
      TextFieldProps: {
        sx: { "& .MuiInputBase-input": { fontFamily: "mono" } },
      },
      gridCols: { xs: 12, sm: 6 },
    },
    {
      type: FieldType.singleSelect,
      name: "tableType",
      label: "Table type",
      defaultValue: "primaryCollection",
      options: [
        {
          label: (
            <div>
              Primary collection
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{
                  width: 240,
                  whiteSpace: "normal",
                  ".MuiSelect-select &": { display: "none" },
                }}
              >
                Connect this table to the <b>single collection</b> matching the
                collection name entered above
              </Typography>
            </div>
          ),
          value: "primaryCollection",
        },
        {
          label: (
            <div>
              Collection group
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{
                  width: 240,
                  whiteSpace: "normal",
                  ".MuiSelect-select &": { display: "none" },
                }}
              >
                Connect this table to <b>all collections and subcollections</b>{" "}
                matching the collection name entered above
              </Typography>
            </div>
          ),
          value: "collectionGroup",
        },
      ],
      required: true,
      disabled: mode === TableSettingsDialogModes.update,
      assistiveText: (
        <>
          Cannot be edited
          {mode === TableSettingsDialogModes.create && " later"}.{" "}
          <Link
            href="https://firebase.googleblog.com/2019/06/understanding-collection-group-queries.html"
            target="_blank"
            rel="noopener noreferrer"
            display="block"
          >
            Learn more about collection groups
            <OpenInNewIcon />
          </Link>
        </>
      ),
      gridCols: { xs: 12, sm: 6 },
    },

    {
      type: FieldType.contentHeader,
      name: "_contentHeader_userFacing",
      label: "Display",
    },
    {
      type: FieldType.singleSelect,
      name: "section",
      label: "Section (optional)",
      labelPlural: "sections",
      freeText: true,
      options: sections,
      required: false,
      gridCols: { xs: 12, sm: 6 },
    },
    {
      type: FieldType.paragraph,
      name: "description",
      label: "Description (optional)",
      gridCols: { xs: 12, sm: 6 },
      minRows: 1,
    },

    {
      type: FieldType.contentHeader,
      name: "_contentHeader_admin",
      label: "Access controls",
    },
    {
      type: FieldType.multiSelect,
      name: "roles",
      label: "Accessed by",
      labelPlural: "roles",
      options: roles ?? [],
      defaultValue: ["ADMIN"],
      required: true,
      freeText: true,
    },
    {
      type: FieldType.contentParagraph,
      name: "_contentParagraph_rules",
      label: (
        <>
          To enable access controls for this table, you must set the
          corresponding Firestore Security Rules.{" "}
          <Link
            href={WIKI_LINKS.setupRoles + "#table-rules"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ position: "relative", zIndex: 1 }}
          >
            Learn how to write rules
            <OpenInNewIcon />
          </Link>
        </>
      ),
    },
    {
      type: "suggestedRules",
      name: "_suggestedRules",
      label: "Suggested Firestore Rules",
      watchedField: "collection",
    },
    {
      type: FieldType.slider,
      name: "triggerDepth",
      defaultValue: 1,
      min: 1,
      max: 5,
      label: "Collection depth",
      displayCondition: "return values.tableType === 'collectionGroup'",
      assistiveText: (
        <>
          {name} Cloud Functions that rely on{" "}
          <Link
            href="https://firebase.google.com/docs/functions/firestore-events#function_triggers"
            target="_blank"
            rel="noopener noreferrer"
          >
            Firestore triggers
          </Link>{" "}
          on this table require you to manually set the depth of this collection
          group.
          <br />
          <Link
            href="https://stackoverflow.com/questions/58186741/watch-a-collectiongroup-with-firestore-using-cloud-functions"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about this requirement
            <OpenInNewIcon />
          </Link>
        </>
      ),
    },

    {
      type: FieldType.contentHeader,
      name: "_contentHeader_audit",
      label: "Auditing",
    },
    {
      type: FieldType.checkbox,
      name: "audit",
      label: "Enable auditing for this table",
      defaultValue: true,
      assistiveText: "Track when users create or update rows",
    },
    {
      type: FieldType.shortText,
      name: "auditFieldCreatedBy",
      label: "Created By field key (optional)",
      defaultValue: "_createdBy",
      displayCondition: "return values.audit",
      assistiveText: "Optionally change the field key",
      gridCols: { xs: 12, sm: 6 },
      sx: { "& .MuiInputBase-input": { fontFamily: "mono" } },
    },
    {
      type: FieldType.shortText,
      name: "auditFieldUpdatedBy",
      label: "Updated By field key (optional)",
      defaultValue: "_updatedBy",
      displayCondition: "return values.audit",
      assistiveText: "Optionally change the field key",
      gridCols: { xs: 12, sm: 6 },
      sx: { "& .MuiInputBase-input": { fontFamily: "mono" } },
    },

    mode === TableSettingsDialogModes.create
      ? {
          type: FieldType.contentHeader,
          name: "_contentHeader_columns",
          label: "Columns",
        }
      : null,
    mode === TableSettingsDialogModes.create && tables && tables?.length !== 0
      ? {
          type: FieldType.singleSelect,
          name: "schemaSource",
          label: "Copy columns from existing table (optional)",
          labelPlural: "tables",
          options: tables,
          clearable: true,
          freeText: false,
          itemRenderer: (option: {
            value: string;
            label: string;
            section: string;
            collection: string;
          }) => (
            <>
              {option.section} &gt; {option.label}{" "}
              <code style={{ marginLeft: "auto" }}>{option.collection}</code>
            </>
          ),
        }
      : null,
    mode === TableSettingsDialogModes.create
      ? {
          type: FieldType.contentSubHeader,
          name: "_contentSubHeader_initialColumns",
          label: "Initial columns",
          sx: { "&&": { mb: 1 }, typography: "button", ml: 2 / 8 },
        }
      : null,
    mode === TableSettingsDialogModes.create
      ? {
          type: FieldType.checkbox,
          name: `_initialColumns.${TableFieldType.createdBy}`,
          label: "Created By",
          displayCondition: "return values.audit",
          gridCols: 6,
          disablePaddingTop: true,
        }
      : null,
    mode === TableSettingsDialogModes.create
      ? {
          type: FieldType.checkbox,
          name: `_initialColumns.${TableFieldType.updatedBy}`,
          label: "Updated By",
          displayCondition: "return values.audit",
          gridCols: 6,
          disablePaddingTop: true,
        }
      : null,
    mode === TableSettingsDialogModes.create
      ? {
          type: FieldType.checkbox,
          name: `_initialColumns.${TableFieldType.createdAt}`,
          label: "Created At",
          displayCondition: "return values.audit",
          gridCols: 6,
          disablePaddingTop: true,
        }
      : null,
    mode === TableSettingsDialogModes.create
      ? {
          type: FieldType.checkbox,
          name: `_initialColumns.${TableFieldType.updatedAt}`,
          label: "Updated At",
          displayCondition: "return values.audit",
          gridCols: 6,
          disablePaddingTop: true,
        }
      : null,
    mode === TableSettingsDialogModes.create
      ? {
          type: FieldType.checkbox,
          name: `_initialColumns.${TableFieldType.id}`,
          label: "Row ID",
          disablePaddingTop: true,
        }
      : null,
  ].filter((field) => field !== null) as Field[];
