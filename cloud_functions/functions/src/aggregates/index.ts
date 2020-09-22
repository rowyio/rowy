import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { db } from "../config";
import config, { collectionPath } from "../functionConfig";
// generated using generateConfig.ts

const incrementor = (v: number) => admin.firestore.FieldValue.increment(v);
const functionConfig: any = config;

const subDocTrigger = async (
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) => {
  const beforeData = change.before?.data();
  const afterData = change.after?.data();
  const triggerType =
    Boolean(beforeData) && Boolean(afterData)
      ? "update"
      : Boolean(afterData)
      ? "create"
      : "delete";
  const parentDocRef = change.after
    ? change.after.ref.parent.parent
    : change.before.ref.parent.parent;
  const parentDoc = await parentDocRef?.get();
  const parentDocData = parentDoc?.data();
  console.log(
    JSON.stringify({
      parentDocRef,
      parentDocData,
      beforeData,
      afterData,
      triggerType,
    })
  );
  //return false;
  const aggregateData = await functionConfig.reduce(
    async (accAggregate: any, currAggregate) => {
      // check relavent sub-table
      if (currAggregate.subtables.includes(context.params.subCollectionId)) {
        const newValue = await currAggregate.eval(db)({
          beforeData,
          afterData,
          incrementor,
          triggerType,
        });
        if (newValue !== undefined) {
          return {
            ...(await accAggregate),
            ...Object.keys(newValue).reduce((acc, curr) => {
              return {
                ...acc,
                [`${currAggregate.fieldName}.${curr}`]: newValue[curr],
              };
            }, {}),
          };
        } else return await accAggregate;
      } else return await accAggregate;
    },
    {}
  );
  const update = Object.keys(aggregateData).reduce((acc: any, curr: string) => {
    if (aggregateData[curr] !== undefined) {
      return { ...acc, [curr]: aggregateData[curr] };
    } else {
      return acc;
    }
  }, {});
  console.log({ update, aggregateData });
  if (parentDocRef && Object.keys(update).length !== 0) {
    return parentDocRef.update(update);
  }
  return false;
};

export const FT_aggregates = {
  [collectionPath.replace("-", "_")]: functions.firestore
    .document(`${collectionPath}/{parentId}/{subCollectionId}/{docId}`)
    .onWrite(subDocTrigger),
};
