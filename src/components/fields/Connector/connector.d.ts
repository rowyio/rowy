type ConnectorUser = {
  timestamp: Date;
  displayName: string;
  email: string;
  uid: string;
  emailVerified: boolean;
  photoURL: string;
  roles: string[];
};
type ConnectorContext = {
  row: Row;
  ref: FirebaseFirestore.DocumentReference;
  storage: firebasestorage.Storage;
  db: FirebaseFirestore.Firestore;
  auth: firebaseauth.BaseAuth;
  query: string;
  user: ConnectorUser;
  logging: RowyLogging;
};
type ConnectorResult = any[];
type Connector = (
  context: ConnectorContext
) => Promise<ConnectorResult> | ActionResult;
