export const dependencies = {
  twilio: "3.56.0",
};
const twilioMessage = async (data) => {
  const utilFns = require("../utils");
  const { accountSid, authToken } = await utilFns.getSecret("twilio");
  const client = require("twilio")(accountSid, authToken);
  const { body, from, to } = data;
  return client.messages
    .create({ body, from, to })
    .then((message) => console.log(message.sid));
};
export default twilioMessage;
