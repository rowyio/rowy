import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { matchSorter } from "match-sorter";

export default function useBasicSearch<T>(
  list: T[],
  keys: string[],
  debounce: number = 400
) {
  const [query, setQuery] = useState("");
  const [handleQuery] = useDebouncedCallback(setQuery, debounce);

  const results = query ? matchSorter(list, query, { keys }) : list;

  return [results, query, handleQuery] as const;
}
