type Condition = (args: {
  req: WebHookRequest;
  db: FirebaseFirestore.Firestore;
  ref: FirebaseFirestore.CollectionReference;
  res: Response;
  logging: {
    log: (payload: any) => void;
    warn: (payload: any) => void;
    error: (payload: any) => void;
  };
}) => Promise<any>;

type Parser = (args: {
  req: WebHookRequest;
  db: FirebaseFirestore.Firestore;
  ref: FirebaseFirestore.CollectionReference;
  logging: {
    log: (payload: any) => void;
    warn: (payload: any) => void;
    error: (payload: any) => void;
  };
}) => Promise<any>;
