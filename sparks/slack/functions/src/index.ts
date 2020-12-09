import { pubsub, config } from "firebase-functions";
export const env = config();
import { WebClient } from "@slack/web-api";

const SPARK_TOPIC = "spark_slack";

async function asyncForEach(array: any[], callback: Function) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const web = new WebClient(env.slackbot.token);

const messageByChannel = async ({
  text,
  channel,
  blocks,
}: {
  channel: string;
  text: string;
  blocks: any[];
}) =>
  await web.chat.postMessage({
    text,
    channel,
    blocks,
  });

const messageByEmail = async ({
  email,
  text,
  blocks,
}: {
  email: string;
  text: string;
  blocks: any[];
}) => {
  try {
    const user = await web.users.lookupByEmail({ email });
    if (user.ok) {
      const channel = (user as any).user.id as string;
      return await messageByChannel({
        text,
        blocks,
        channel,
      });
    } else {
      return await false;
    }
  } catch (error) {
    console.log(`${error} maybe${email} is not on slack`);
    console.log(`${error}`);
    return await false;
  }
};

export const spark_slack = pubsub
  .topic(SPARK_TOPIC)
  .onPublish(async (message, context) => {
    const messageBody = message.data
      ? Buffer.from(message.data, "base64").toString("utf-8")
      : "{}";
    const data = JSON.parse(messageBody);
    const { channels, emails, text, blocks } = data;
    if (channels) {
      await asyncForEach(channels, async (channel: string) => {
        await messageByChannel({
          text,
          blocks: blocks ?? [],
          channel,
        });
      });
    }
    if (emails) {
      await asyncForEach(emails, async (email: string) => {
        await messageByEmail({
          text: text,
          blocks: blocks ?? [],
          email,
        });
      });
    }
    return true;
  });
