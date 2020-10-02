import { firestore } from "firebase-functions";

import { env } from "../config";
import { WebClient } from "@slack/web-api";
import { asyncForEach, serverTimestamp } from "../utils";
// Initialize
const web = new WebClient(env.slackbot ? env.slackbot.token : "NEEDS_CONFIG");

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

export const slackBotMessageOnCreate = firestore
  .document(`slackBotMessages/{docId}`)
  .onCreate(async (snapshot) => {
    const docData = snapshot.data();
    if (!docData) {
      return snapshot.ref.update({
        delivered: false,
        error: "undefined doc",
      });
    }
    try {
      const channels = docData.channel ? [docData.channel] : docData.channels;
      const emails = docData.email ? [docData.email] : docData.emails;
      if (channels) {
        await asyncForEach(channels, async (channel: string) => {
          await messageByChannel({
            text: docData.text,
            blocks: docData.blocks,
            channel,
          });
        });
      } else if (emails) {
        await asyncForEach(emails, async (email: string) => {
          await messageByEmail({
            text: docData.text,
            blocks: docData.blocks ?? [],
            email,
          });
        });
      }

      return snapshot.ref.update({
        delivered: true,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
      return snapshot.ref.update({
        delivered: false,
        updatedAt: serverTimestamp(),
        error: JSON.stringify(error),
      });
    }
  });
