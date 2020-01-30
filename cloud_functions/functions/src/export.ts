import { parse as json2csv } from "json2csv";
import * as functions from "firebase-functions";
import { db } from "./config";
import * as admin from "firebase-admin";
const enum FieldType {
  simpleText = "SIMPLE_TEXT",
  longText = "LONG_TEXT",
  email = "EMAIL",
  PhoneNumber = "PHONE_NUMBER",
  checkBox = "CHECK_BOX",
  date = "DATE", //TODO
  dateTime = "DATE_TIME", //TODO
  number = "NUMBER",
  url = "URL",
  color = "COLOR", //TODO
  rating = "RATING",
  image = "IMAGE",
  file = "FILE",
  singleSelect = "SINGLE_SELECT",
  multiSelect = "MULTI_SELECT",
  documentSelect = "DOCUMENT_SELECT",
  last = "LAST",
}
const selectedColumnsReducer = (doc: any) => (
  accumulator: any,
  currentColumn: any
) => {
  switch (currentColumn.type) {
    case FieldType.multiSelect:
      return {
        ...accumulator,
        [currentColumn.key]: doc[currentColumn.key]
          ? doc[currentColumn.key].join()
          : "",
      };
    case FieldType.file:
    case FieldType.image:
      return {
        ...accumulator,
        [currentColumn.key]: doc[currentColumn.key]
          ? doc[currentColumn.key]
              .map((item: { downloadURL: string }) => item.downloadURL)
              .join()
          : "",
      };
    case FieldType.documentSelect:
      return {
        ...accumulator,
        [currentColumn.key]: doc[currentColumn.key]
          ? doc[currentColumn.key]
              .map((item: any) =>
                currentColumn.config.primaryKeys.reduce(
                  (labelAccumulator: string, currentKey: any) =>
                    `${labelAccumulator} ${item.snapshot[currentKey]}`,
                  ""
                )
              )
              .join()
          : "",
      };
    case FieldType.checkBox:
      return {
        ...accumulator,
        [currentColumn.key]:
          typeof doc[currentColumn.key] === "boolean"
            ? doc[currentColumn.key]
              ? "YES"
              : "NO"
            : "",
      };
    case FieldType.dateTime:
      return {
        ...accumulator,
        [currentColumn.key]: doc[currentColumn.key]
          ? doc[currentColumn.key].toDate()
          : "",
      };
    case FieldType.last:
      return accumulator;
    default:
      return {
        ...accumulator,
        [currentColumn.key]: doc[currentColumn.key]
          ? doc[currentColumn.key]
          : "",
      };
  }
};
export const exportTable = functions.https.onCall(
  async (
    request: {
      collectionPath: string;
      filters: {
        key: string;
        operator: "==" | "<" | ">" | ">=" | "<=";
        value: string;
      }[];
      limit?: number;
      sort?:
        | { field: string; direction: "asc" | "desc" }[]
        | { field: string; direction: "asc" | "desc" };
      columns: { key: string; type: FieldType; config: any }[];
      allFields?: boolean;
    },

    response
  ) => {
    const {
      collectionPath,
      filters,
      sort,
      limit,
      columns,
      allFields,
    } = request;

    // set query path
    let query:
      | admin.firestore.CollectionReference
      | admin.firestore.Query = db.collection(collectionPath);
    // add filters
    filters.forEach(filter => {
      query = query.where(filter.key, filter.operator, filter.value);
    });
    // optional order results
    if (sort) {
      if (Array.isArray(sort)) {
        sort.forEach(order => {
          query = query.orderBy(order.field, order.direction);
        });
      } else {
        query = query.orderBy(sort.field, sort.direction);
      }
    }
    //optional set query limit
    if (limit) query = query.limit(limit);
    const querySnapshot = await query.get();
    const docs = querySnapshot.docs.map(doc => doc.data());
    // generate csv Data
    const data = docs.map((doc: any) => {
      return columns.reduce(selectedColumnsReducer(doc), {});
    });

    // let data = docs;
    // if (!allFields) {
    //   console.log("");
    //   docs.map((doc: any) => {
    //     return columns.reduce(selectedColumnsReducer(doc), {});
    //   });
    // }

    const csv = json2csv(data);
    return csv;
  }
);
