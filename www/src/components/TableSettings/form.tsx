import { Field, FieldType } from "@antlerengineering/form-builder";
import { TableSettingsDialogModes } from "./index";

import { Link, Typography } from "@material-ui/core";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import { MONO_FONT } from "Themes";
import { projectId } from "../../firebase";
import WIKI_LINKS from "constants/wikiLinks";

export const tableSettings = (
  mode: TableSettingsDialogModes | null,
  roles: string[] | undefined,
  sections: string[] | undefined,
  tables: { label: string; value: any }[] | undefined
): Field[] =>
  [
    {
      type: FieldType.shortText,
      name: "name",
      label: "Table Name",
      required: true,
    },
    {
      type: FieldType.shortText,
      name: "collection",
      label: "Collection Name",
      required: true,
      assistiveText: (
        <Link
          href={`https://console.firebase.google.com/project/${projectId}/firestore/data`}
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
      ) as any,
    },
    {
      type: FieldType.singleSelect,
      name: "tableType",
      label: "Table Type",
      labelPlural: "table types",
      searchable: false,
      defaultValue: "primaryCollection",
      options: [
        {
          label: "Primary Collection",
          description: `
          Connect this table to the <strong>single collection</strong>
          matching the collection name entered above`,
          value: "primaryCollection",
        },
        {
          label: "Collection Group",
          description: `
          Connect this table to <strong>all collections and subcollections</strong>
          matching the collection name entered above`,
          value: "collectionGroup",
        },
      ],
      required: true,
      disabled: mode === TableSettingsDialogModes.update,
      itemRenderer: (option) => (
        <span key={option.value}>
          {option.label}
          <Typography
            variant="body2"
            color="textSecondary"
            component="span"
            display="block"
            dangerouslySetInnerHTML={{ __html: option.description }}
          />
        </span>
      ),
      assistiveText: (
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
      ) as any,
    },
    {
      type: FieldType.singleSelect,
      name: "section",
      label: "Section",
      freeText: true,
      options: sections,
      required: true,
    },
    {
      type: FieldType.paragraph,
      name: "description",
      label: "Description",
    },
    {
      type: FieldType.multiSelect,
      name: "roles",
      label: "Accessed By",
      options: roles ?? [],
      required: true,
      freeText: true,
      assistiveText: (
        <>
          Choose which roles have access to this table. Remember to set the
          appropriate Firestore Security Rules for this collection.
          <Link
            href={WIKI_LINKS.securityRules}
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
        </>
      ) as any,
    },
    {
      type: FieldType.slider,
      name: "triggerDepth",
      defaultValue: 1,
      min: 1,
      max: 5,
      label: "Collection Depth",
      displayCondition: "return values.tableType === 'collectionGroup'",
      assistiveText: (
        <>
          Firetable Cloud Functions that rely on{" "}
          <Link
            href="https://firebase.google.com/docs/functions/firestore-events#function_triggers"
            target="_blank"
            rel="noopener"
          >
            Firestore triggers
          </Link>{" "}
          on this table require you to manually set the depth of this collection
          group.
          <br />
          <Link
            href="https://stackoverflow.com/questions/58186741/watch-a-collectiongroup-with-firestore-using-cloud-functions"
            target="_blank"
            rel="noopener"
          >
            Learn more about this requirement
            <OpenInNewIcon
              aria-label="Open in new tab"
              fontSize="small"
              style={{ verticalAlign: "bottom", marginLeft: 4 }}
            />
          </Link>
        </>
      ),
    },
    mode === TableSettingsDialogModes.create && tables && tables?.length !== 0
      ? {
          type: FieldType.singleSelect,
          name: "schemaSource",
          label: "Copy column config from existing table",
          labelPlural: "Tables",
          options: tables,
          freeText: false,
          itemRenderer: (option: { value: string; label: string }) => (
            <span key={option.value}>
              {option.label}
              <Typography
                variant="body2"
                color="textSecondary"
                component="span"
                style={{ fontFamily: MONO_FONT, display: "block" }}
              >
                {option.value}
              </Typography>
            </span>
          ),
        }
      : null,
  ].filter((field) => field !== null) as Field[];
