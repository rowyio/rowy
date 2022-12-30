type DefaultValueContext = {
  row: Row;
  ref: FirebaseFirestore.DocumentReference;
  storage: firebasestorage.Storage;
  db: FirebaseFirestore.Firestore;
  auth: firebaseauth.BaseAuth;
  logging: RowyLogging;
};
type DefaultValue = (context: DefaultValueContext) => "PLACEHOLDER_OUTPUT_TYPE";
