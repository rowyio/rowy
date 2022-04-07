type Condition = (args: {
  req: WebHookRequest;
  db: FirebaseFirestore.Firestore;
  ref: FirebaseFirestore.CollectionReference;
  res: Response;
}) => Promise<any>;
type Parser = (args: {
  req: WebHookRequest;
  db: FirebaseFirestore.Firestore;
  ref: FirebaseFirestore.CollectionReference;
}) => Promise<any>;
