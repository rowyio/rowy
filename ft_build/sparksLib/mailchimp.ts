export const dependencies = {
  "mailchimp-api-v3": "1.15.0",
};
// method : 'get|post|put|patch|delete'
// path :`/lists/${listId}/members`
const mailchimp = async (data) => {
  const { path, method, path_params, body, query } = data;
  const mailchimpLib = require("mailchimp-api-v3");
  const utilFns = require("../utils");
  const mailchimpKey = await utilFns.getSecret("mailchimp");
  const _mailchimp = new mailchimpLib(mailchimpKey);
  return new Promise((resolve, reject) => {
    _mailchimp.request(
      {
        method,
        path,
        path_params,
        body,
        query,
      },
      resolve
    );
  });
};
export default mailchimp;
