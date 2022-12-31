type Condition = (args: {
  req: WebHookRequest;
  db: FirebaseFirestore.Firestore;
  ref: FirebaseFirestore.CollectionReference;
  res: Response;
  logging: RowyLogging;
}) => Promise<any>;

type Parser = (args: {
  req: WebHookRequest;
  db: FirebaseFirestore.Firestore;
  ref: FirebaseFirestore.CollectionReference;
  logging: RowyLogging;
}) => Promise<any>;
