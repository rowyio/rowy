type ActionUser = {
  timestamp: Date;
  displayName: string;
  email: string;
  uid: string;
  emailVerified: boolean;
  photoURL: string;
  roles: string[];
};
type ActionContext = {
  row: Row;
  ref: FirebaseFirestore.DocumentReference;
  storage: firebasestorage.Storage;
  db: FirebaseFirestore.Firestore;
  auth: firebaseauth.BaseAuth;
  actionParams: actionParams;
  user: ActionUser;
  logging: RowyLogging;
};

type ActionResult = {
  success: boolean;
  message?: any;
  status?: string | number | null | undefined;
  link?: string | { url: string; label: string };
};

type Action = (context: ActionContext) => Promise<ActionResult> | ActionResult;
