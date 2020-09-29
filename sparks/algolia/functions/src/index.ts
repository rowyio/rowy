import algoliasearch from "algoliasearch";
import { pubsub, config } from "firebase-functions";
export const env = config();

const APP_ID = env.algolia ? env.algolia.app : "NEEDS_CONFIG";
const ADMIN_KEY = env.algolia ? env.algolia.key : "NEEDS_CONFIG";

const client = algoliasearch(APP_ID, ADMIN_KEY);

const SPARK_TOPIC = "spark_algolia";

export const spark_algolia = pubsub
  .topic(SPARK_TOPIC)
  .onPublish(async (message, context) => {
    const messageBody = message.data
      ? Buffer.from(message.data, "base64").toString("utf-8")
      : "{}";
    const data = JSON.parse(messageBody);
    const { triggerType, record, objectID, index } = data;
    const _index = client.initIndex(index); // initialize algolia index
    console.log({ triggerType, record, objectID, index });
    switch (triggerType) {
      case "delete":
        await _index.deleteObject(objectID);
        break;
      case "update":
      case "create":
        await _index.saveObject({ ...record, objectID });
        break;
      default:
        break;
    }
    return true;
  });
