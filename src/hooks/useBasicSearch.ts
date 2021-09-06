import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function useBasicSearch<T>(
  collection: T[],
  predicate: (item: T, query: string) => boolean,
  debounce: number = 400
) {
  const [query, setQuery] = useState("");
  const [handleQuery] = useDebouncedCallback(setQuery, debounce);

  const results = query
    ? collection.filter((user) => predicate(user, query.toLowerCase()))
    : collection;

  return [results, query, handleQuery] as const;
}
