const sgMail = require("@sendgrid/mail");
import { env } from "../config";
sgMail.setSubstitutionWrappers("{{", "}}");
if (env.send_grid) sgMail.setApiKey(env.send_grid.key);

export const sendEmail = (msg: any) => sgMail.send(msg);
