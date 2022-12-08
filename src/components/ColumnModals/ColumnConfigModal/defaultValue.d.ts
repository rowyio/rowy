type DefaultValueContext = {
  row: Row;
  ref: FirebaseFirestore.DocumentReference;
  storage: firebasestorage.Storage;
  db: FirebaseFirestore.Firestore;
  auth: firebaseauth.BaseAuth;
  logging: {
    log: (payload: any) => void;
    warn: (payload: any) => void;
    error: (payload: any) => void;
  };
};
type DefaultValue = (context: DefaultValueContext) => "PLACEHOLDER_OUTPUT_TYPE";
