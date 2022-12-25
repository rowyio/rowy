type FormulaContext = {
  row: Row;
  // ref: FirebaseFirestore.DocumentReference;
  // storage: firebasestorage.Storage;
  // db: FirebaseFirestore.Firestore;
};

type Formula = (context: FormulaContext) => "PLACEHOLDER_OUTPUT_TYPE";
