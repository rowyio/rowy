import { pubsub, config } from "firebase-functions";
const env = config();
const sgMail = require("@sendgrid/mail");
sgMail.setSubstitutionWrappers("{{", "}}");
sgMail.setApiKey(env.send_grid.key);
const SPARK_TOPIC = "spark_sendgrid";
export const spark_sendgrid = pubsub
  .topic(SPARK_TOPIC)
  .onPublish(async (message, context) => {
    const sparkBody = message.data
      ? Buffer.from(message.data, "base64").toString("utf-8")
      : "{}";
    const data = JSON.parse(sparkBody);
    const { msg } = data;
    sgMail.send(msg);
    return true;
  });
