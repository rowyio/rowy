import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function useBasicSearch<T>(
  list: T[],
  predicate: (item: T, query: string) => boolean,
  debounce: number = 400
) {
  const [query, setQuery] = useState("");
  const [handleQuery] = useDebouncedCallback(setQuery, debounce);

  const results = query
    ? list.filter((user) => predicate(user, query.toLowerCase()))
    : list;

  return [results, query, handleQuery] as const;
}
