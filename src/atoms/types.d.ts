export type UpdateDocFunction<T> = (update: Partial<T>) => Promise<void>;

export type UpdateCollectionFunction<T> = (
  path: string,
  update: Partial<T>
) => Promise<void>;
