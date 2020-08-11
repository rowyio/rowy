const sgMail = require("@sendgrid/mail");
import * as sgClient from "@sendgrid/client";
import * as _ from "lodash";
import { env } from "../config";

sgMail.setApiKey(env.send_grid.key);
sgClient.setApiKey(env.send_grid.key);
sgMail.setSubstitutionWrappers("{{", "}}");

export const sendEmail = (msg: any) => sgMail.send(msg);
