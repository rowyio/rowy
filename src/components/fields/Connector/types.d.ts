type ConnectService = (request: {
  query: string;
  row: any;
  user: any;
}) => Promise<any[]>;
