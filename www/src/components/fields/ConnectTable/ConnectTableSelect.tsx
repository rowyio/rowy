import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import useAlgolia from "use-algolia";
import _find from "lodash/find";
import _get from "lodash/get";
import _pick from "lodash/pick";

import MultiSelect, { MultiSelectProps } from "@antlerengineering/multiselect";
import Loading from "components/Loading";
import { getAlgoliaSearchKey } from "../../../firebase/callables";
import createPersistedState from "use-persisted-state";
const useAlgoliaSearchKeys = createPersistedState("algolia-search");

export type ConnectTableValue = {
  docPath: string;
  snapshot: Record<string, any>;
};

const replacer = (data: any) => (m: string, key: string) => {
  const objKey = key.split(":")[0];
  const defaultValue = key.split(":")[1] || "";
  return _get(data, objKey, defaultValue);
};

export interface IConnectTableSelectProps {
  value: ConnectTableValue[];
  onChange: (value: ConnectTableValue[]) => void;
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
  // Store a local copy of the value so the dropdown doesn’t automatically close
  // when the user selects a new item and we allow for multiple selections
  const [localValue, setLocalValue] = useState(
    Array.isArray(value) ? value : []
  );
  const filters = config.filters
    ? config.filters.replace(/\{\{(.*?)\}\}/g, replacer(row))
    : "";
  const algoliaIndex = config.index;

  const [algoliaSearchKeys, setAlgoliaSearchKeys] = useAlgoliaSearchKeys<any>(
    {}
  );
  const [algoliaState, requestDispatch, , setAlgoliaConfig] = useAlgolia(
    process.env.REACT_APP_ALGOLIA_APP_ID!,
    process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY ?? "",
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
        indexName: algoliaIndex,
        searchKey: (algoliaSearchKeys?.[algoliaIndex] as any).key,
      });
    } else {
      //'get new key'
      const resp = await getAlgoliaSearchKey(algoliaIndex);
      const key = resp.data.data;
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
  };

  useEffect(() => {
    if (!process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY)
      setAlgoliaSearchKey(algoliaIndex);
  }, [algoliaIndex]);

  const options = algoliaState.hits.map((hit) => ({
    label: config.primaryKeys?.map((key: string) => hit[key]).join(" "),
    value: hit.objectID,
  }));

  // Pass a list of objectIDs to MultiSelect
  const sanitisedValue = localValue.map(
    (item) => item.docPath.split("/")[item.docPath.split("/").length - 1]
  );

  const handleChange = (_newValue) => {
    // Ensure we return an array
    const newValue = Array.isArray(_newValue)
      ? _newValue
      : _newValue !== null
      ? [_newValue]
      : [];

    // Calculate new value
    const newLocalValue = newValue.map((objectID) => {
      // If this objectID is already in the previous value, use that previous
      // value’s snapshot (in case it points to an object not in the current
      // Algolia query)
      const existingMatch = _find(localValue, {
        docPath: `${algoliaIndex}/${objectID}`,
      });
      if (existingMatch) return existingMatch;

      // If this is a completely new selection, grab the snapshot from the
      // current Algolia query
      const match = _find(algoliaState.hits, { objectID });
      const { _highlightResult, ...snapshot } = match;

      // Use snapshotFields to limit snapshots
      let partialSnapshot = snapshot;
      if (
        Array.isArray(config.snapshotFields) &&
        config.snapshotFields.length > 0
      )
        partialSnapshot = _pick(snapshot, config.snapshotFields);

      return {
        snapshot: partialSnapshot,
        docPath: `${algoliaIndex}/${snapshot.objectID}`,
      };
    });

    // If !multiple, we MUST change the value (bypassing localValue),
    // otherwise `setLocalValue` won’t be called in time for the new
    // `localValue` to be read by `handleSave`
    if (config.multiple === false) onChange(newLocalValue);
    // Otherwise, `setLocalValue` until user closes dropdown
    else setLocalValue(newLocalValue);
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
      value={config.multiple === false ? sanitisedValue[0] : sanitisedValue}
      onChange={handleChange}
      onOpen={() => {
        setAlgoliaConfig({
          indexName: algoliaIndex,
        });
        requestDispatch({ filters });
      }}
      onClose={handleSave}
      options={options}
      TextFieldProps={{
        className,
        hiddenLabel: true,
        ...TextFieldProps,
      }}
      label={column?.name}
      labelPlural={config.searchLabel}
      multiple={(config.multiple ?? true) as any}
      {...({
        AutocompleteProps: {
          loading: algoliaState.loading,
          loadingText: <Loading />,
          inputValue: search,
          onInputChange: (_, value, reason) => {
            if (reason === "input") setSearch(value);
          },
          filterOptions: () => options,
        },
      } as any)}
      countText={`${localValue.length} of ${
        algoliaState.response?.nbHits ?? "?"
      }`}
      disabled={disabled}
    />
  );
}
