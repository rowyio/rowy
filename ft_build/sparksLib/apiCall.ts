export const dependencies = {
  "node-fetch": "2.6.1",
};
const api = async (args) => {
  const { body, url, method, callback } = args;
  const fetch = require("node-fetch");
  return fetch(url, { method: method, body: body })
    .then((res) => res.json())
    .then((json) => callback(json));
};
export default api;
