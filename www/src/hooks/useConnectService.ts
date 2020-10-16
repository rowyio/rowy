import { useEffect, useReducer, useState } from "react";

const searchReducer = (prevState: any, newProps: any) => {
  return { ...prevState, ...newProps };
};

function useConnectService(url: string, rowData: any, resultsKey: string) {
  const emptyResults: any[] = [];

  const updateQuery = async (search: string) => {
    searchDispatch({ loading: true, force: false, prevSearch: search });
    const results = await performSearch(url, rowData, search, resultsKey);
    searchDispatch({ results: results, loading: false });
  };
  const [searchState, searchDispatch] = useReducer(searchReducer, {
    search: "",
    prevSearch: "",
    force: false,
    results: emptyResults,
    loading: false,
  });

  useEffect(() => {
    if (searchState.force || searchState.prevSearch !== searchState.search) {
      updateQuery(searchState.search);
    }
  }, [searchState]);

  return [searchState, searchDispatch];
}

async function performSearch(
  url: string,
  rowData: any,
  searchText: string,
  resultsKey: string
): Promise<any[]> {
  const uri = new URL(url),
    params = { q: searchText };
  Object.keys(params).forEach((key) =>
    uri.searchParams.append(key, params[key])
  );

  const resp = await fetch(uri.toString(), {
    method: "POST",
    body: JSON.stringify(rowData),
    headers: { "content-type": "application/json" },
  });

  const js = await resp.json();
  return js[resultsKey];
}

export default useConnectService;
