import React, { useState, useEffect } from "react";
import useAlgolia from "use-algolia";
import _find from "lodash/find";
import { useDebounce } from "use-debounce";

import MultiSelect, { MultiSelectProps } from "@antlerengineering/multiselect";
import Loading from "components/Loading";

export type ConnectTableValue = {
  snapshot: any;
  docPath: string;
};

export interface IConnectTableSelectProps {
  value: ConnectTableValue[];
  onChange: (value: ConnectTableValue[]) => void;
  row: any;
  column: any;
  collectionPath: string;
  config: {
    filters: string;
    primaryKeys: string[];
    secondaryKeys: string[];
    multiple?: boolean;
    [key: string]: any;
  };
  editable?: boolean;
  /** Optional style overrides for root MUI `TextField` component */
  className?: string;
  /** Override any props of the root MUI `TextField` component */
  TextFieldProps?: MultiSelectProps<ConnectTableValue[]>["TextFieldProps"];
}

export default function ConnectTableSelect({
  value = [],
  onChange,
  row,
  column,

  collectionPath,
  config,
  editable,
  className,

  TextFieldProps = {},
}: IConnectTableSelectProps) {
  // Store a local copy of the value so the dropdown doesn’t automatically close
  // when the user selects a new item and we allow for multiple selections
  const [localValue, setLocalValue] = useState(
    Array.isArray(value) ? value : []
  );

  const [algoliaState, requestDispatch, , setAlgoliaConfig] = useAlgolia(
    process.env.REACT_APP_ALGOLIA_APP_ID!,
    process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY!,
    "" // Don’t choose the index until the user opens the dropdown
  );
  const algoliaIndex = collectionPath ?? config.index;
  const options = algoliaState.hits.map((hit) => ({
    label: config?.primaryKeys?.map((key: string) => hit[key]).join(" "),
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
      return {
        snapshot,
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
      onOpen={() => setAlgoliaConfig({ indexName: algoliaIndex })}
      onClose={handleSave}
      options={options}
      TextFieldProps={{
        className,
        hiddenLabel: true,
        ...TextFieldProps,
      }}
      label={column?.name}
      multiple={(config?.multiple ?? true) as any}
      AutocompleteProps={{
        loading: algoliaState.loading,
        loadingText: <Loading />,
        inputValue: search,
        onInputChange: (_, value, reason) => {
          if (reason === "input") setSearch(value);
        },
        filterOptions: () => options,
      }}
      countText={`${localValue.length} of ${
        algoliaState.response?.nbHits ?? "?"
      }`}
      disabled={editable === false}
    />
  );
}
