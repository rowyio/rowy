/*
{ channels?:string[], emails?:string[], text?:string, blocks?:any,attachments?:any }
*/

export const dependencies = {
  "@slack/web-api": "^6.0.0",
};

const initSlack = async () => {
  const { getSecret } = require("../utils");
  const { token } = await getSecret("slack");
  const { WebClient } = require("@slack/web-api");
  return new WebClient(token);
};

const messageByChannel = (slackClient) => async ({
  text,
  channel,
  blocks,
  attachments,
}: {
  channel: string;
  text: string;
  blocks: any[];
  attachments: any[];
}) =>
  await slackClient.chat.postMessage({
    text,
    channel,
    blocks,
    attachments,
  });

const messageByEmail = (slackClient) => async ({
  email,
  text,
  blocks,
  attachments,
}: {
  email: string;
  text: string;
  blocks: any[];
  attachments: any[];
}) => {
  try {
    const user = await slackClient.users.lookupByEmail({ email });
    if (user.ok) {
      const channel = user.user.id;
      return await messageByChannel(slackClient)({
        text,
        blocks,
        attachments,
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

const slackMessage = async (data) => {
  const slackClient = await initSlack();
  const { channels, emails, text, blocks, attachments } = data;
  if (channels) {
    const messages = channels.map((channel: string) =>
      messageByChannel(slackClient)({
        text,
        blocks: blocks ?? [],
        channel,
        attachments,
      })
    );
    await Promise.all(messages);
  }
  if (emails) {
    const messages = emails.map((email: string) =>
      messageByEmail(slackClient)({
        text: text,
        blocks: blocks ?? [],
        email,
        attachments,
      })
    );
    await Promise.all(messages);
  }
  return true;
};
export default slackMessage;
