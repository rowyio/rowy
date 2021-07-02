type ISparkType =
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

type ISparkTrigger = "create" | "update" | "delete";

interface ISparkEditor {
  displayName: string;
  photoURL: string;
  lastUpdate: number;
}

interface ISpark {
  // firetable meta fields
  name: string;
  active: boolean;
  lastEditor: ISparkEditor;

  // ft build fields
  triggers: ISparkTrigger[];
  type: ISparkType;
  requiredFields: string[];
  sparkBody: string;
  shouldRun: boolean | string;

  // TODO break spark body into editable fields
}

const triggerTypes: ISparkTrigger[] = ["create", "update", "delete"];

const sparkTypes: ISparkType[] = [
  "task",
  "docSync",
  "historySnapshot",
  "algoliaIndex",
  "meiliIndex",
  "bigqueryIndex",
  "slackMessage",
  "sendgridEmail",
  "apiCall",
  "twilioMessage",
];

function emptySparkObject(type: ISparkType, user: ISparkEditor): ISpark {
  return {
    name: "Unnamed",
    active: false,
    triggers: [],
    type,
    sparkBody: "{}",
    requiredFields: [],
    shouldRun: "return true;",
    lastEditor: user,
  };
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

export {
  parseSparkConfig,
  serialiseSpark,
  sparkTypes,
  triggerTypes,
  emptySparkObject,
};
export type { ISpark, ISparkType, ISparkEditor };
