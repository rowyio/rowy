type RowRef = Pick<FirebaseFirestore.DocumentReference, "id", "path">;

type FormulaContext = {
  row: Row;
  ref: RowRef;
  // storage: firebasestorage.Storage;
  // db: FirebaseFirestore.Firestore;
};

type Formula = (context: FormulaContext) => "PLACEHOLDER_OUTPUT_TYPE";
