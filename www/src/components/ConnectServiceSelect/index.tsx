import React, { useEffect, useState } from "react";

import { TextFieldProps } from "@material-ui/core";

import Loading from "components/Loading";
import MultiSelect from "@antlerengineering/multiselect";
import useConnectService from "../../hooks/useConnectService";
import _get from "lodash/get";
import { useDebounce } from "use-debounce";

export type ServiceValue = {
  primaryKey: string;
  title: string;
  subtitle: string;
  [prop: string]: any;
};

export interface IConnectServiceSelectProps {
  value: ServiceValue | null;
  onChange: (value: ServiceValue | null) => void;
  column: any;
  row: any;
  config: {
    primaryKey: string;
    titleKey: string;
    subtitleKey: string;
    resultsKey: string;
    [key: string]: any;
  };
  editable?: boolean;
  /** Optional style overrides for root MUI `TextField` component */
  className?: string;
  /** Override any props of the root MUI `TextField` component */
  TextFieldProps?: Partial<TextFieldProps>;
}

export default function ConnectServiceSelect({
  value = null,
  className,
  TextFieldProps = {},
  column,
  config,
  onChange,
  editable,
  ...props
}: IConnectServiceSelectProps) {
  const url = config.url;
  const titleKey = config.titleKey ?? config.primaryKey;
  const resultsKey = config.resultsKey;
  const primaryKey = config.primaryKey;

  const row = Object.assign({}, props.row, { ref: undefined });
  const [searchState, searchDispatch] = useConnectService(url, row, resultsKey);

  const options = searchState.results.map((hit) => ({
    label: _get(hit, titleKey) ?? _get(hit, primaryKey),
    value: _get(hit, primaryKey),
  }));

  const sanitizedValue = value ? _get(value, primaryKey) : null;

  const handleChange = (_newValue) => {
    // Ensure we return an array
    let newValue: any;

    if (Array.isArray(_newValue)) {
      if (_newValue.length > 0) {
        newValue = _newValue[0];
      } else {
        newValue = null;
      }
    } else {
      newValue = _newValue;
    }

    let newLocalValue: ServiceValue | null = null;
    if (newValue) {
      const results = searchState.results as any[];
      newLocalValue = results.find((r) => _get(r, primaryKey) == newValue);
    }
    onChange(newLocalValue);
  };

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 1000);
  useEffect(() => {
    searchDispatch({ search: debouncedSearch });
  }, [debouncedSearch]);

  return (
    <MultiSelect
      value={sanitizedValue}
      onChange={handleChange}
      onOpen={() => searchDispatch({ search: "", force: true })}
      options={options}
      TextFieldProps={{
        className,
        hiddenLabel: true,
        ...TextFieldProps,
      }}
      label={column?.name}
      multiple={false}
      AutocompleteProps={{
        loading: searchState.loading,
        loadingText: <Loading />,
        inputValue: search,
        onInputChange: (_, value, reason) => {
          if (reason === "input") setSearch(value);
        },
        filterOptions: () => options,
      }}
      disabled={editable === false}
    />
  );
}
