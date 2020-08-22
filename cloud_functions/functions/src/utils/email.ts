const sgMail = require("@sendgrid/mail");
import { env } from "../config";

sgMail.setApiKey(env.send_grid.key);
sgMail.setSubstitutionWrappers("{{", "}}");

export const sendEmail = (msg: any) => sgMail.send(msg);
