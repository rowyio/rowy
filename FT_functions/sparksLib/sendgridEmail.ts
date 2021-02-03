export const dependencies = {
  "@sendgrid/mail": "^7.4.2",
};
const sendgridEmail = async (data) => {
  const { msg } = data;
  const sgMail = require("@sendgrid/mail");
  const utilFns = require("../utils");
  sgMail.setSubstitutionWrappers("{{", "}}");
  const sendgridKey = await utilFns.getSecret("sendgrid");
  sgMail.setApiKey(sendgridKey);
  return sgMail.send(msg);
};
export default sendgridEmail;
