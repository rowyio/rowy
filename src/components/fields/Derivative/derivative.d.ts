type DerivativeContext = {
  row: Row;
  ref: FirebaseFirestore.DocumentReference;
  storage: firebasestorage.Storage;
  db: FirebaseFirestore.Firestore;
  auth: firebaseauth.BaseAuth;
  change: any;
  logging: {
    log: (payload: any) => void;
    warn: (payload: any) => void;
    error: (payload: any) => void;
  };
};

type Derivative = (context: DerivativeContext) => "PLACEHOLDER_OUTPUT_TYPE";
