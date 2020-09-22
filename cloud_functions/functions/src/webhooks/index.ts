import { db } from "../config";
import * as functions from "firebase-functions";
// const fetch = require("node-fetch");

//import * as crypto from "crypto";

//const TYPEFORM_SECRET = "testsecret123";
//const verifySignature = function (secret, receivedSignature, payload) {
//   const hash = crypto
//     .createHmac("sha256", secret)
//     .update(payload)
//     .digest("base64");
//   console.log(receivedSignature, `sha256=${hash}`);
//   return receivedSignature === `sha256=${hash}`;
// };

//const file = bucket.file('path/to/image.jpg');

const typeformParser = (body) => ({
  _ft_createdAt: body.form_response.submitted_at,
  ...body.form_response.hidden,
  ...body.form_response.answers.reduce((accRow, currAnswer) => {
    switch (currAnswer.type) {
      case "date":
        return {
          ...accRow,
          [currAnswer.field.ref]: new Date(currAnswer[currAnswer.type]),
        };
      case "choice":
        return {
          ...accRow,
          [currAnswer.field.ref]: currAnswer[currAnswer.type].label,
        };
      case "choices":
        return {
          ...accRow,
          [currAnswer.field.ref]: currAnswer[currAnswer.type].labels,
        };
      case "file_url":
      default:
        return {
          ...accRow,
          [currAnswer.field.ref]: currAnswer[currAnswer.type],
        };
    }
  }, {}),
});

export const webhook = functions.https.onRequest(async (req, res) => {
  const { body, url, query } = req;
  console.log(JSON.stringify({ body, url, query }));
  const schemaDocPath = `_FIRETABLE_/settings/schema/${decodeURIComponent(
    query.tablePath as string
  )}`;
  const schemaDoc = await db.doc(schemaDocPath).get();
  const schemaDocData = schemaDoc.data();
  if (!schemaDocData) {
    res.sendStatus(404);
  }
  if (!schemaDocData?.webhooks.enabled) {
    res.sendStatus(401);
  }

  if (query.type === "CUSTOM") {
    console.log({ schemaDocData });
  } else if (query.type === "TYPE_FORM") {
    //    const receivedSignature = req.header("Typeform-Signature");
    const secret = schemaDocData?.webhooks.secret;
    //   const isValidSignature = verifySignature(
    //   TYPEFORM_SECRET,
    //   receivedSignature,
    //   req.body.toString()
    //    );
    if (req.query.secret === secret) {
      const newRow = typeformParser(req.body);
      await db
        .collection(decodeURIComponent(req.query.tablePath as string))
        .add(newRow);
    } else {
      res.sendStatus(403);
    }
  }
  res.sendStatus(200);
});
