import { useEffect, useReducer, useState, useContext } from "react";
import algoliasearch, { SearchIndex } from "algoliasearch";

export const createAlgoliaIndex = (indexName: string, searchKey: string) => {
  const algolia = algoliasearch(
    `${process.env.REACT_APP_ALGOLIA_APP_ID}`,
    searchKey
  );
  const index = algolia.initIndex(indexName);
  return index;
};

const searchReducer = (prevState: any, action: any) => {
  switch (action.type) {
    case "more":
      return { ...prevState, limit: prevState.limit + 10 };
    default:
      return { ...prevState, ...action };
  }
};

function useAlgolia(indexName: string, searchKey: string, filters?: string) {
  const [searchState, searchDispatch] = useReducer(searchReducer, {
    search: "",
    filters: filters ? filters : "",
    prevSearch: "",
    prevFilters: "",
    results: [],
    limit: 200,
    prevLimit: 200,
  });

  const index = createAlgoliaIndex(indexName, searchKey);
  const updateQuery = async (
    index: SearchIndex,
    search: string,
    filters: any,
    limit: number
  ) => {
    searchDispatch({
      prevSearch: search,
      prevFilters: filters,
      prevLimit: limit,
      limit,
      loading: true,
    });
    const results = await index.search(search, {
      hitsPerPage: limit,
      filters,
    });
    searchDispatch({ results, loading: false });
  };

  useEffect(() => {
    const {
      search,
      prevSearch,
      filters,
      limit,
      prevLimit,
      prevFilters,
    } = searchState;

    if (search !== prevSearch || filters !== prevFilters) {
      updateQuery(index, search, filters, 20);
    } else if (prevLimit !== limit) {
      updateQuery(index, search, filters, limit);
    }
    return () => {};
  }, [searchState]);

  return [searchState, searchDispatch];
}

export default useAlgolia;
