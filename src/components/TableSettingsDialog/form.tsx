import { find } from "lodash-es";
import { useAtom } from "jotai";
import { Field, FieldType } from "@rowy/form-builder";
import {
  projectIdAtom,
  projectScope,
  TableSettingsDialogState,
} from "@src/atoms/projectScope";

import { Link, ListItemText, Typography } from "@mui/material";
import OpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import WarningIcon from "@mui/icons-material/WarningAmber";

import { WIKI_LINKS } from "@src/constants/externalLinks";
import { FieldType as TableFieldType } from "@src/constants/fields";

function CollectionLink() {
  const [projectId] = useAtom(projectIdAtom, projectScope);

  return (
    <Link
      href={`https://console.firebase.google.com/project/${projectId}/firestore/data`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Your collections
      <OpenInNewIcon />
    </Link>
  );
}

export const tableSettings = (
  mode: TableSettingsDialogState["mode"],
  roles: string[] | undefined,
  sections: string[] | undefined,
  tables:
    | { label: string; value: any; section: string; collection: string }[]
    | undefined,
  collections: string[] | null
): Field[] =>
  [
    // Step 1: Collection
    {
      step: "collection",
      type: FieldType.singleSelect,
      name: "tableType",
      label: "Table type",
      defaultValue: "primaryCollection",
      options: [
        {
          label: (
            <ListItemText
              primary="Primary collection"
              secondary={
                <>
                  Connect this table to the <b>single collection</b> matching
                  the collection name entered below
                </>
              }
              style={{ maxWidth: 470 }}
            />
          ),
          value: "primaryCollection",
        },
        {
          label: (
            <ListItemText
              primary="Collection group"
              secondary={
                <>
                  Connect this table to{" "}
                  <b>all collections and subcollections</b> matching the
                  collection name entered below
                </>
              }
              style={{ maxWidth: 470 }}
            />
          ),
          value: "collectionGroup",
        },
      ],
      required: true,
      disabled: mode === "update",
      assistiveText: (
        <>
          Cannot be edited
          {mode === "create" && " later"}.{" "}
          <Link
            href="https://firebase.googleblog.com/2019/06/understanding-collection-group-queries.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about collection groups
            <OpenInNewIcon />
          </Link>
        </>
      ),
    },
    Array.isArray(collections)
      ? {
          step: "collection",
          type: FieldType.singleSelect,
          name: "collection",
          label: "Collection",
          labelPlural: "collections",
          options: collections,
          itemRenderer: (option: any) => (
            <code key={option.value}>{option.label}</code>
          ),
          freeText: true,
          required: true,
          assistiveText: (
            <>
              {mode === "update" ? (
                <>
                  <WarningIcon
                    color="warning"
                    aria-label="Warning"
                    sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }}
                  />
                  You can change which Firestore collection to display. Data in
                  the new collection must be compatible with the existing
                  columns.
                </>
              ) : (
                "Choose which Firestore collection to display."
              )}{" "}
              <CollectionLink />
            </>
          ),
          AddButtonProps: {
            children: "Create collection or use custom path…",
          },
          AddDialogProps: {
            title: "Create collection or use custom path",
            textFieldLabel: (
              <>
                Collection name
                <Typography variant="caption" display="block">
                  If this collection does not exist, it won’t be created until
                  you add a row to the table
                </Typography>
              </>
            ),
          },
          TextFieldProps: {
            sx: { "& .MuiInputBase-input": { fontFamily: "mono" } },
          },
          // https://firebase.google.com/docs/firestore/quotas#collections_documents_and_fields
          validation: [
            ["matches", /^[^\s]+$/, "Collection name cannot have spaces"],
            ["matches", /^[^.]+$/, "Collection name cannot have dots"],
            ["notOneOf", [".", ".."], "Collection name cannot be . or .."],
            [
              "test",
              "double-underscore",
              "Collection name cannot begin and end with __",
              (value: any) => !value.startsWith("__") && !value.endsWith("__"),
            ],
          ],
        }
      : {
          step: "collection",
          type: FieldType.shortText,
          name: "collection",
          label: "Collection name",
          required: true,
          assistiveText: (
            <>
              {mode === "update" ? (
                <>
                  <WarningIcon
                    color="warning"
                    aria-label="Warning"
                    sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }}
                  />
                  You can change which Firestore collection to display. Data in
                  the new collection must be compatible with the existing
                  columns.
                </>
              ) : (
                "Type the name of the Firestore collection to display."
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
          sx: { "& .MuiInputBase-input": { fontFamily: "mono" } },
          // https://firebase.google.com/docs/firestore/quotas#collections_documents_and_fields
          validation: [
            ["matches", /^[^\s]+$/, "Collection name cannot have spaces"],
            ["matches", /^[^.]+$/, "Collection name cannot have dots"],
            ["notOneOf", [".", ".."], "Collection name cannot be . or .."],
            [
              "test",
              "double-underscore",
              "Collection name cannot begin and end with __",
              (value: any) => !value.startsWith("__") && !value.endsWith("__"),
            ],
          ],
        },

    // Step 2: Display
    {
      step: "display",
      type: "tableName",
      name: "name",
      label: "Table name",
      required: true,
      watchedField: "collection",
      assistiveText: "User-facing name for this table",
      autoFocus: true,
      gridCols: { xs: 12, sm: 6 },
    },
    {
      step: "display",
      type: "tableId",
      name: "id",
      label: "Table ID",
      required: true,
      watchedField: "name",
      assistiveText: `Unique ID used to store this table’s configuration. Cannot be edited${
        mode === "create" ? " later" : ""
      }.`,
      disabled: mode === "update",
      gridCols: { xs: 12, sm: 6 },
      validation: [
        ["matches", /^[^/]+$/g, "ID cannot have /"],
        ...(mode === "create"
          ? [
              [
                "test",
                "unique",
                "Another table exists with this ID",
                (value: any) => !find(tables, ["value", value]),
              ],
            ]
          : []),
      ],
    },
    {
      step: "display",
      type: FieldType.singleSelect,
      name: "section",
      label: "Section (optional)",
      labelPlural: "sections",
      freeText: true,
      options: sections,
      required: false,
    },
    {
      step: "display",
      type: FieldType.paragraph,
      name: "description",
      label: "Description (optional)",
    },
    {
      step: "display",
      type: "tableDetails",
      name: "details",
      label: "Details (optional)",
    },
    {
      step: "display",
      type: "tableThumbnail",
      name: "thumbnailFile",
      label: "Thumbnail image (optional)",
    },
    {
      step: "display",
      type: FieldType.hidden,
      name: "thumbnailURL",
    },

    // Step 3: Access controls
    {
      step: "accessControls",
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
      step: "accessControls",
      type: FieldType.checkbox,
      name: "readOnly",
      label: "Read-only for non-ADMIN users",
      assistiveText:
        "Disable all editing functionality. Locks all columns and disables adding and deleting rows and columns.",
      defaultValue: false,
    },
    {
      step: "accessControls",
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
      step: "accessControls",
      type: "suggestedRules",
      name: "_suggestedRules",
      label: "Suggested Firestore Rules",
      watchedField: "collection",
    },
    {
      step: "accessControls",
      type: FieldType.multiSelect,
      name: "modifiableBy",
      label: "Modifiable by",
      labelPlural: "Modifier Roles",
      options: roles ?? [],
      defaultValue: ["ADMIN"],
      required: true,
      freeText: true,
    },

    // Step 4: Auditing
    {
      step: "auditing",
      type: FieldType.checkbox,
      name: "audit",
      label: "Enable auditing for this table",
      defaultValue: false,
    },
    {
      step: "auditing",
      type: FieldType.shortText,
      name: "auditFieldCreatedBy",
      label: "Created By field key (optional)",
      defaultValue: "_createdBy",
      displayCondition: "return values.audit",
      assistiveText:
        mode === "update" ? (
          <>
            You can change the field key.
            <br />
            <WarningIcon
              color="warning"
              aria-label="Warning"
              sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }}
            />
            You’ll need to delete and re-add any Created By or Created At
            columns.
          </>
        ) : (
          "Optionally, change the field key"
        ),
      gridCols: { xs: 12, sm: 6 },
      sx: { "& .MuiInputBase-input": { fontFamily: "mono" } },
    },
    {
      step: "auditing",
      type: FieldType.shortText,
      name: "auditFieldUpdatedBy",
      label: "Updated By field key (optional)",
      defaultValue: "_updatedBy",
      displayCondition: "return values.audit",
      assistiveText:
        mode === "update" ? (
          <>
            You can change the field key.
            <br />
            <WarningIcon
              color="warning"
              aria-label="Warning"
              sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }}
            />
            You’ll need to delete and re-add any Updated By or Updated At
            columns.
          </>
        ) : (
          "Optionally, change the field key"
        ),
      gridCols: { xs: 12, sm: 6 },
      sx: { "& .MuiInputBase-input": { fontFamily: "mono" } },
    },
    // Step 5:Cloud functions
    /*
    {
      step: "function",
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
      step: "function",
      type: FieldType.singleSelect,
      name: "function.memory",
      label: "Memory Allocation",
      defaultValue: "256MB",
      options: ["128MB", "256MB", "512MB", "1GB", "2GB", "4GB", "8GB"],
      required: true,
      gridCols: { xs: 12, sm: 6 },
    },
    {
      step: "function",
      type: FieldType.shortText,
      name: "function.timeout",
      label: "Timeout",
      defaultValue: 60,
      InputProps: {
        type: "number",
        endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
      },
      gridCols: { xs: 12, sm: 6 },
    },
    {
      step: "function",
      type: FieldType.contentSubHeader,
      name: "functionHeader",
      label: "Auto scaling",

      assistiveText: (
        <>
          <Link
            href="https://firebase.google.com/docs/functions/autoscaling"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about auto scaling
            <OpenInNewIcon />
          </Link>
        </>
      ),
    },
    {
      step: "function",
      type: FieldType.shortText,
      name: "function.minInstances",
      label: "Minimum Instances",
      defaultValue: 0,
      InputProps: {
        type: "number",
      },
      gridCols: { xs: 12, sm: 6 },
    },
    {
      step: "function",
      type: FieldType.shortText,
      name: "function.maxInstances",
      label: "Maximum Instances",
      defaultValue: 1000,
      InputProps: {
        type: "number",
      },
      gridCols: { xs: 12, sm: 6 },
    },
    */
    mode === "create" && tables && tables?.length !== 0
      ? {
          step: "columns",
          type: FieldType.singleSelect,
          name: "_schemaSource",
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
    mode === "create"
      ? {
          step: "columns",
          type: FieldType.contentSubHeader,
          name: "_contentSubHeader_initialColumns",
          label: "Initial columns",
          sx: { "&&": { mb: 1 }, typography: "button", ml: 2 / 8 },
        }
      : null,
    mode === "create"
      ? {
          step: "columns",
          type: FieldType.checkbox,
          name: `_initialColumns.${TableFieldType.createdBy}`,
          label: "Created By",
          displayCondition: "return values.audit",
          gridCols: 6,
          disablePaddingTop: true,
        }
      : null,
    mode === "create"
      ? {
          step: "columns",
          type: FieldType.checkbox,
          name: `_initialColumns.${TableFieldType.updatedBy}`,
          label: "Updated By",
          displayCondition: "return values.audit",
          gridCols: 6,
          disablePaddingTop: true,
        }
      : null,
    mode === "create"
      ? {
          step: "columns",
          type: FieldType.checkbox,
          name: `_initialColumns.${TableFieldType.createdAt}`,
          label: "Created At",
          displayCondition: "return values.audit",
          gridCols: 6,
          disablePaddingTop: true,
        }
      : null,
    mode === "create"
      ? {
          step: "columns",
          type: FieldType.checkbox,
          name: `_initialColumns.${TableFieldType.updatedAt}`,
          label: "Updated At",
          displayCondition: "return values.audit",
          gridCols: 6,
          disablePaddingTop: true,
        }
      : null,
    mode === "create"
      ? {
          step: "columns",
          type: FieldType.checkbox,
          name: `_initialColumns.${TableFieldType.id}`,
          label: "Row ID",
          disablePaddingTop: true,
        }
      : null,
  ].filter((field) => field !== null) as Field[];
