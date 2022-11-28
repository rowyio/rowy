import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import useAlgolia from "use-algolia";
import { find, get, pick } from "lodash-es";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useSnackbar } from "notistack";

import { Button } from "@mui/material";
import MultiSelect, { MultiSelectProps } from "@rowy/multiselect";
import Loading from "@src/components/Loading";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import { projectScope, rowyRunAtom } from "@src/atoms/projectScope";
import { tableScope } from "@src/atoms/tableScope";
import { runRoutes } from "@src/constants/runRoutes";
import { WIKI_LINKS } from "@src/constants/externalLinks";

const algoliaSearchKeysAtom = atomWithStorage(
  "__ROWY__ALGOLIA_SEARCH_KEYS",
  {} as Record<string, { key: string; requestedAt: number }>
);

const algoliaAppIdAtom = atomWithStorage<string | undefined>(
  "__ROWY__ALGOLIA_APP_ID",
  undefined
);

export type ConnectTableValue = {
  docPath: string;
  snapshot: Record<string, any>;
};

const replacer = (data: any) => (m: string, key: string) => {
  const objKey = key.split(":")[0];
  const defaultValue = key.split(":")[1] || "";
  return get(data, objKey, defaultValue);
};

export interface IConnectTableSelectProps {
  value: ConnectTableValue[] | ConnectTableValue | null;
  onChange: (value: ConnectTableValue[] | ConnectTableValue | null) => void;
  column: any;
  config: {
    filters: string;
    primaryKeys: string[];
    secondaryKeys?: string[];
    snapshotFields?: string[];
    trackedFields?: string[];
    multiple?: boolean;
    searchLabel?: string;
    [key: string]: any;
  };
  disabled?: boolean;
  /** Optional style overrides for root MUI `TextField` component */
  className?: string;
  row: any;
  /** Override any props of the root MUI `TextField` component */
  TextFieldProps?: MultiSelectProps<ConnectTableValue[]>["TextFieldProps"];
  onClose?: MultiSelectProps<ConnectTableValue[]>["onClose"];
  /** Load the Algolia index before the MultiSelect onOpen function is triggered */
  loadBeforeOpen?: boolean;
}

export default function ConnectTableSelect({
  value = [],
  onChange,
  column,
  row,
  config,
  disabled,
  className,
  TextFieldProps = {},
  onClose,
  loadBeforeOpen,
}: IConnectTableSelectProps) {
  const { enqueueSnackbar } = useSnackbar();

  const [rowyRun] = useAtom(rowyRunAtom, projectScope);
  const [algoliaAppId, setAlgoliaAppId] = useAtom(algoliaAppIdAtom, tableScope);

  useEffect(() => {
    if (!algoliaAppId && rowyRun) {
      rowyRun({ route: runRoutes.algoliaAppId }).then(
        ({ success, appId, message }) => {
          if (success) setAlgoliaAppId(appId);
          else
            enqueueSnackbar(
              message.replace("not setup", "not set up") +
                ": Failed to get app ID",
              {
                variant: "error",
                action: (
                  <Button
                    href={WIKI_LINKS.fieldTypesConnectTable}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Docs
                    <InlineOpenInNewIcon />
                  </Button>
                ),
              }
            );
        }
      );
    }
  }, []);

  const filters = config.filters
    ? config.filters.replace(/\{\{(.*?)\}\}/g, replacer(row))
    : "";

  const algoliaIndex = config.index;
  const [algoliaSearchKeys, setAlgoliaSearchKeys] = useAtom(
    algoliaSearchKeysAtom,
    tableScope
  );

  const [algoliaState, requestDispatch, , setAlgoliaConfig] = useAlgolia(
    "",
    "",
    // Don’t choose the index until the user opens the dropdown if !loadBeforeOpen
    loadBeforeOpen ? algoliaIndex : "",
    { filters }
  );

  const setAlgoliaSearchKey = async (algoliaIndex: string) => {
    const requestedAt = Date.now() / 1000;
    if (
      algoliaSearchKeys &&
      (algoliaSearchKeys?.[algoliaIndex] as any)?.key &&
      requestedAt <
        (algoliaSearchKeys?.[algoliaIndex] as any).requestedAt + 3600
    ) {
      //'use existing key'
      setAlgoliaConfig({
        appId: algoliaAppId,
        indexName: algoliaIndex,
        searchKey: (algoliaSearchKeys?.[algoliaIndex] as any).key,
      });
    } else {
      //'get new key'
      if (rowyRun) {
        const resp = await rowyRun({
          route: runRoutes.algoliaSearchKey,
          params: [algoliaIndex as string],
        });
        const { key } = resp;
        if (key) {
          const newKey = {
            key,
            requestedAt,
          };
          setAlgoliaSearchKeys(
            algoliaSearchKeys
              ? { ...algoliaSearchKeys, [algoliaIndex]: newKey }
              : { [algoliaIndex]: newKey }
          );
          setAlgoliaConfig({ indexName: algoliaIndex, searchKey: key });
        }
      }
    }
  };

  useEffect(() => {
    setAlgoliaSearchKey(algoliaIndex);
  }, [algoliaIndex]);

  const options = algoliaState.hits.map((hit: Record<string, any>) => ({
    label: config.primaryKeys?.map((key: string) => hit[key]).join(" "),
    value: hit.objectID,
  }));

  // Store a local copy of the value so the dropdown doesn’t automatically close
  // when the user selects a new item and we allow for multiple selections
  let initialLocalValue: any;
  if (config.multiple !== false) {
    initialLocalValue = Array.isArray(value)
      ? value
      : value?.docPath
      ? [value]
      : [];
  } else {
    initialLocalValue = Array.isArray(value)
      ? value[0]
      : value?.docPath
      ? value
      : null;
  }
  const [localValue, setLocalValue] = useState(initialLocalValue);

  // Pass objectID[] | objectID | null to MultiSelect
  const sanitisedValue =
    config.multiple !== false
      ? localValue.map((item: any) => item.docPath.split("/").pop())
      : localValue?.docPath?.split("/").pop() ?? null;

  const handleChange = (_newValue: string[] | string | null) => {
    let newLocalValue: any;
    if (config.multiple !== false && Array.isArray(_newValue)) {
      newLocalValue = (_newValue as string[])
        .map((objectID) => {
          const docPath = `${algoliaIndex}/${objectID}`;

          // Try to find the snapshot from the current Algolia query
          const match = find(algoliaState.hits, { objectID });

          // If not found and this objectID is already in the previous value,
          // use that previous value’s snapshot
          // Else return null
          if (!match) {
            const existingMatch = find(localValue, { docPath });
            if (existingMatch) return existingMatch;
            else return null;
          }

          const { _highlightResult, ...snapshot } = match;

          // Use snapshotFields to limit snapshots
          let partialSnapshot = snapshot;
          if (
            Array.isArray(config.snapshotFields) &&
            config.snapshotFields.length > 0
          )
            partialSnapshot = pick(snapshot, config.snapshotFields);

          return { snapshot: partialSnapshot, docPath };
        })
        .filter((x) => x !== null);
    } else if (config.multiple === false && typeof _newValue === "string") {
      const docPath = `${algoliaIndex}/${_newValue}`;

      // Try to find the snapshot from the current Algolia query
      const match = find(algoliaState.hits, { objectID: _newValue });

      // If not found and this objectID is the previous value, use that or null
      if (!match) {
        if (localValue?.docPath === docPath) newLocalValue = localValue;
        else newLocalValue = null;
      } else {
        const { _highlightResult, ...snapshot } = match;

        // Use snapshotFields to limit snapshots
        let partialSnapshot = snapshot;
        if (
          Array.isArray(config.snapshotFields) &&
          config.snapshotFields.length > 0
        )
          partialSnapshot = pick(snapshot, config.snapshotFields);

        newLocalValue = { snapshot: partialSnapshot, docPath };
      }
    } else if (config.multiple === false && _newValue === null) {
      newLocalValue = null;
    }

    // Store in `localValue` until user closes dropdown and triggers `handleSave`
    setLocalValue(newLocalValue);

    // If !multiple, we MUST change the value (bypassing localValue),
    // otherwise `setLocalValue` won’t be called in time for the new
    // `localValue` to be read by `handleSave` because this component is
    // unmounted before `handleSave` is called
    if (config.multiple === false) onChange(newLocalValue);
  };

  // Save when user closes dropdown
  const handleSave = () => {
    if (config.multiple !== false) onChange(localValue);
    if (onClose) onClose();
  };
  // Change MultiSelect input field to search Algolia directly
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 1000);
  useEffect(() => {
    requestDispatch({ query: debouncedSearch });
  }, [debouncedSearch]);

  return (
    <MultiSelect
      value={sanitisedValue}
      onChange={handleChange}
      onOpen={() => {
        setAlgoliaConfig({ indexName: algoliaIndex });
        requestDispatch({ filters });
      }}
      onClose={handleSave}
      options={options}
      TextFieldProps={{
        className,
        hiddenLabel: true,
        SelectProps: {
          renderValue: () => {
            if (Array.isArray(localValue)) {
              if (localValue.length !== 1)
                return `${localValue.length} selected`;
              return config.primaryKeys
                ?.map((key: string) => localValue[0]?.snapshot?.[key])
                .join(" ");
            } else {
              if (!localValue?.snapshot) return "0 selected";
              return config.primaryKeys
                ?.map((key: string) => localValue?.snapshot?.[key])
                .join(" ");
            }
          },
        },
        ...TextFieldProps,
      }}
      label={column?.name}
      labelPlural={config.searchLabel}
      multiple={config.multiple !== false}
      {...({
        AutocompleteProps: {
          loading: algoliaState.loading,
          loadingText: <Loading />,
          inputValue: search,
          onInputChange: (_: any, value: any, reason: any) => {
            if (reason === "input") setSearch(value);
          },
          filterOptions: () => options,
        },
      } as any)}
      countText={
        Array.isArray(localValue)
          ? `${localValue.length} of ${algoliaState.response?.nbHits ?? "?"}`
          : undefined
      }
      disabled={disabled}
    />
  );
}
