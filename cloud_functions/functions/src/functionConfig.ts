export default [
  {
    fieldName: "reviewsSummary",
    eval: (db) => async ({
      aggregateState,
      incrementor,
      triggerType,
      change,
      afterData,
      beforeData,
    }) => {
      //triggerType:  create | update | delete
      //aggregateState: the subtable accumenlator stored in the cell of this column
      //change: the triggered document change snapshot of the the subcollection
      //afterData
      //beforeData
      //incrementor: short for firebase.firestore.FieldValue.increment(n);
      //This script needs to return the new aggregateState cell value.
      switch (triggerType) {
        case "create":
          const rating = afterData?.rating ?? 0;
          return {
            numberOfReviews: incrementor(1),
            accumulatedStars: incrementor(rating),
          };
        case "update":
          const prevRating = beforeData?.rating ?? 0;
          const newRating = afterData?.rating ?? 0;
          return {
            accumulatedStars: incrementor(newRating - prevRating),
          };
        case "delete":
          const removeStars = -(beforeData?.rating ?? 0);
          return {
            numberOfReviews: incrementor(-1),
            accumulatedStars: incrementor(removeStars),
          };
        default:
          return {};
      }
    },
    subtables: ["reviews"],
  },
];
export const collectionPath = "mvpResources";
