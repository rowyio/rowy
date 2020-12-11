const sgMail = require("@sendgrid/mail");
sgMail.setSubstitutionWrappers("{{", "}}");
sgMail.setApiKey(env.send_grid.key);
export const dependencies = {
  "@sendgrid/mail": "^7.2.6",
};
export const spark_sendgrid = (data) => sgMail.send(data);
