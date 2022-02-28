type DerivativeContext = {
  row: Row;
  ref: FirebaseFirestore.DocumentReference;
  storage: firebasestorage.Storage;
  db: FirebaseFirestore.Firestore;
  auth: firebaseauth.BaseAuth;
  change: any;
};

type Derivative = (context: DerivativeContext) => Promise<any>;
