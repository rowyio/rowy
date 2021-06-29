// export { triggerCloudBuild, cloudBuildUpdates } from "./buildTriggers"; // a callable used for triggering cloudbuild to build and deploy configurable cloud functions
// export {
//   scheduledFirestoreBackup, // callableFirestoreBackup
// } from "./backup";
// import * as callableFns from "./callable";

// export const callable = callableFns;

// // all the cloud functions bellow are deployed using the triggerCloudBuild callable  function
// // these functions are designed to be built and deployed based on the configuration passed through the callable

// export { FT_aggregates } from "./aggregates";
// export { FT_subTableStats } from "./subTableStats";

// export { actionScript } from "./actionScript";

// export { webhook } from "./webhooks";

// export { FT_snapshotSync } from "./snapshotSync";

// export { FT_compressedThumbnail } from "./compressedThumbnail";

export {getAlgoliaSearchKey} from './algoliaSearchKey'

//deprecated, updated implementation moved to FT_build folder and used within sparks table functions
// export { FT_derivatives } from "./derivatives";
// export { FT_algolia } from "./algolia";
// export { FT_email } from "./emailOnTrigger";
// export { FT_slack } from "./slackOnTrigger";
// export { FT_sync } from "./collectionSync";
// export { FT_spark } from "./sparks";
// export { FT_history } from "./history";
// export { slackBotMessageOnCreate } from "./slackOnTrigger/trigger";