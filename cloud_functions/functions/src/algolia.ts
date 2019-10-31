import * as algolia from "algoliasearch";
import * as functions from "firebase-functions";
import { env } from "./config";
export const updateAlgoliaRecord = functions.https.onCall(
  async (data: any, context: any) => {
    const client = algolia(env.algolia.appid, env.algolia.apikey);
    const index = client.initIndex(data.collection);
    await index.partialUpdateObject({
      objectID: data.id,
      ...data.doc,
    });
    return true;
  }
);

export const deleteAlgoliaRecord = functions.https.onCall(
  async (data: any, context: any) => {
    const client = algolia(env.algolia.appid, env.algolia.apikey);
    const index = client.initIndex(data.collection);
    await index.deleteObject(data.id);
    return true;
  }
);
