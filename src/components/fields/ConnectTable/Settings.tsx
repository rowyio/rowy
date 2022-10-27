import { useEffect } from "react";
import { useAsyncMemo } from "use-async-memo";
import { ISettingsProps } from "@src/components/fields/types";
import { sortBy } from "lodash-es";
import { useAtom, useSetAtom } from "jotai";

import {
  Typography,
  Link,
  TextField,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from "@mui/material";
import MultiSelect from "@rowy/multiselect";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import WarningIcon from "@mui/icons-material/WarningAmberOutlined";

import {
  projectScope,
  getTableSchemaAtom,
  tablesAtom,
  projectSettingsAtom,
  rowyRunModalAtom,
} from "@src/atoms/projectScope";
import { FieldType } from "@src/constants/fields";
import { WIKI_LINKS } from "@src/constants/externalLinks";

export default function Settings({ onChange, config }: ISettingsProps) {
  const [tables] = useAtom(tablesAtom, projectScope);
  const [projectSettings] = useAtom(projectSettingsAtom, projectScope);
  const openRowyRunModal = useSetAtom(rowyRunModalAtom, projectScope);
  const [getTableSchema] = useAtom(getTableSchemaAtom, projectScope);

  useEffect(() => {
    if (!projectSettings.rowyRunUrl)
      openRowyRunModal({ feature: "Connect Table fields" });
  }, [projectSettings.rowyRunUrl, openRowyRunModal]);

  const tableOptions = sortBy(
    tables?.map((table) => ({
      label: table.name,
      value: table.id,
      section: table.section,
      collection: table.collection,
    })) ?? [],
    ["section", "label"]
  );

  const columns = useAsyncMemo(
    async () => {
      const id = config.index; // ???
      if (!getTableSchema || !id) return [];
      const tableConfig = await getTableSchema(id);
      return Object.values(tableConfig.columns ?? {}).map((c: any) => ({
        label: c.name,
        value: c.key,
        type: c.type,
      }));
    },
    [config.index, getTableSchema],
    []
  );

  return (
    <>
      <Typography>
        Connect Table requires additional setup.{" "}
        <Link
          href={WIKI_LINKS.fieldTypesConnectTable}
          target="_blank"
          rel="noopener noreferrer"
        >
          Instructions
          <InlineOpenInNewIcon />
        </Link>
      </Typography>

      <MultiSelect
        options={tableOptions}
        freeText={false}
        value={config.index}
        onChange={onChange("index")}
        multiple={false}
        label="Table"
        labelPlural="tables"
        itemRenderer={(option: Record<string, string>) => (
          <>
            {option.section} &gt; {option.label}{" "}
            <code style={{ marginLeft: "auto" }}>{option.collection}</code>
          </>
        )}
        TextFieldProps={{
          helperText:
            "Make sure this table is being synced to an Algolia index",
        }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={config.multiple !== false}
            onChange={(e) => onChange("multiple")(e.target.checked)}
          />
        }
        label={
          <>
            Multiple selection
            <FormHelperText>
              {config.multiple === false ? (
                <>
                  Field values will be either{" "}
                  <code>
                    {"{ docPath: string; snapshot: Record<string, any>; }"}
                  </code>{" "}
                  or <code>null</code>.<br />
                  Easier to filter.
                </>
              ) : (
                <>
                  Field values will be an array of{" "}
                  <code>
                    {"{ docPath: string; snapshot: Record<string, any>; }"}
                  </code>{" "}
                  or an empty array.
                  <br />
                  Harder to filter.
                </>
              )}
            </FormHelperText>
            <FormHelperText>
              <WarningIcon
                color="warning"
                aria-label="Warning: "
                style={{ verticalAlign: "text-bottom", fontSize: "1rem" }}
              />
              &nbsp; Existing values in this table will not be updated
            </FormHelperText>
          </>
        }
        style={{ marginLeft: -10 }}
      />

      <TextField
        label="Filter template"
        name="filters"
        fullWidth
        value={config.filters}
        onChange={(e) => onChange("filters")(e.target.value)}
        placeholder="attribute:value AND | OR | NOT attribute:value"
        id="connectTable-filters"
        helperText={
          <>
            Use the Algolia syntax for filters:{" "}
            <Link
              href="https://www.algolia.com/doc/api-reference/api-parameters/filters/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Algolia documentation
              <InlineOpenInNewIcon />
            </Link>
          </>
        }
      />

      <MultiSelect
        label="Primary keys"
        value={config.primaryKeys ?? []}
        options={columns.filter((c) =>
          [FieldType.shortText, FieldType.singleSelect].includes(c.type)
        )}
        onChange={onChange("primaryKeys")}
        TextFieldProps={{ helperText: "Field values displayed" }}
      />

      <MultiSelect
        label="Snapshot fields"
        value={config.snapshotFields ?? []}
        options={columns.filter((c) => ![FieldType.subTable].includes(c.type))}
        onChange={onChange("snapshotFields")}
        TextFieldProps={{ helperText: "Fields stored in the snapshots" }}
      />

      <MultiSelect
        label="Tracked fields"
        value={config.trackedFields ?? []}
        options={columns.filter((c) => ![FieldType.subTable].includes(c.type))}
        onChange={onChange("trackedFields")}
        TextFieldProps={{
          helperText:
            "Fields to be tracked for changes and synced to the snapshot",
        }}
      />
    </>
  );
}
