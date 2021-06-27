import { db } from "../firebase";
import { useEffect, useReducer } from "react";
const CAP = 300;

const collectionReducer = (prevState: any, newProps: any) => {
  if (newProps.type) {
    switch (newProps.type) {
      case "more":
        if (prevState.limit < prevState.cap)
          // documents count hardcap
          return { ...prevState, limit: prevState.limit + 10 };
        else return { ...prevState };
      default:
        break;
    }
  } else {
    return { ...prevState, ...newProps };
  }
};
const collectionInitialState = {
  documents: [],
  prevFilters: null,
  prevPath: null,
  path: null,
  filters: [],
  prevLimit: 0,
  limit: 200,
  loading: true,
  cap: CAP,
};

type useCollectionOverrides = {
  limit?: number;
  path?: string;
  filters?: {
    field: string;
    operator: firebase.default.firestore.WhereFilterOp;
    value: any;
  }[];
  orderBy?:
    | { key: string; direction: "asc" | "desc" }[]
    | { key: string; direction: "asc" | "desc" };
};
const useCollection = (initialOverrides: useCollectionOverrides) => {
  const [collectionState, collectionDispatch] = useReducer(collectionReducer, {
    ...collectionInitialState,
    ...initialOverrides,
  });

  const getDocuments = (
    filters: useCollectionOverrides["filters"],
    limit: number,
    orderBy: useCollectionOverrides["orderBy"]
  ) => {
    //unsubscribe from old path
    if (
      collectionState.prevPath &&
      collectionState.path !== collectionState.prevPath
    ) {
      collectionState.unsubscribe();
    }
    //updates prev values
    collectionDispatch({
      prevFilters: filters,
      prevLimit: limit,
      prevPath: collectionState.path,
      loading: true,
    });
    let query:
      | firebase.default.firestore.CollectionReference
      | firebase.default.firestore.Query = db.collection(collectionState.path);

    if (filters)
      filters.forEach((filter) => {
        query = query.where(filter.field, filter.operator, filter.value);
      });

    if (orderBy) {
      if (Array.isArray(orderBy)) {
        orderBy.forEach((order) => {
          query = query.orderBy(order.key, order.direction);
        });
      } else {
        query = query.orderBy(orderBy.key, orderBy.direction);
      }
    }
    const unsubscribe = query.limit(limit).onSnapshot(
      (snapshot) => {
        if (snapshot.docs.length > 0) {
          const documents = snapshot.docs
            .map((doc) => {
              const data = doc.data();
              const id = doc.id;
              return { ...data, id };
            })
            .filter((doc) => doc.id !== "_FIRETABLE_");
          collectionDispatch({
            documents,
            loading: false,
          });
        } else {
          collectionDispatch({
            documents: [],
            loading: false,
          });
        }
      },
      (error: any) => {
        console.log({ collectionState, error });
      }
    );
    collectionDispatch({ unsubscribe });
  };
  useEffect(() => {
    const {
      prevFilters,
      filters,
      prevLimit,
      limit,
      prevPath,
      path,
      orderBy,
      unsubscribe,
    } = collectionState;
    if (
      // !equals(prevFilters, filters) ||
      prevLimit !== limit ||
      prevPath !== path
    ) {
      if (path) getDocuments(filters, limit, orderBy);
    }
    return () => {
      if (unsubscribe) {
        collectionState.unsubscribe();
      }
    };
  }, [collectionState.filters, collectionState.limit, collectionState.path]);

  return [collectionState, collectionDispatch];
};

export default useCollection;
