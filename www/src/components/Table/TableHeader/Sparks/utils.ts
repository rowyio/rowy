interface ISpark {
  // firetable meta fields
  name: string;
  active: boolean;

  // ft build fields
  triggers: "create" | "update" | "delete";
  type:
    | "task"
    | "docSync"
    | "historySnapshot"
    | "algoliaIndex"
    | "meiliIndex"
    | "bigqueryIndex"
    | "slackMessage"
    | "sendgridEmail"
    | "apiCall"
    | "twilioMessage";
  shouldRun: boolean;
  requiredFields?: string[];
  sparkBody: any;
}

/* Convert spark objects into a single ft-build readable string */
function serialiseSpark(sparks: ISpark[]): string {
  return "[]";
}

/* Convert ft-build spark config string into spark objects */
function parseSparkConfig(sparkConfig): ISpark[] {
  try {
    // remove leading "sparks.config(" and trailing ")"
    const sanitisedSparks = sparkConfig
      .replace(/^(\s*)sparks.config\(/, "")
      .replace(/\);?\s*$/, "");
    // const sparks = JSON.parse(sanitisedSparks);
    // const sparks = eval(sanitisedSparks);
    console.log(sanitisedSparks);
    console.log(eval(sanitisedSparks));
    // return sparks as ISpark[];
    return [];
  } catch (e) {
    console.log("error parsing sparks", e);
    return [];
  }
}

export { parseSparkConfig, serialiseSpark };
export type { ISpark };
