export type FirestoreEventType =
  | "READ_DOC"
  | "READ_COLLECTION"
  | "CREATE_DOC"
  | "UPDATE_DOC"
  | "DELETE_DOC";

export type FirestoreEvent = {
  type: FirestoreEventType;
  path: string;
  data: any;
};

export class OutputBuilder {
  private _content: string;

  private constructor(content: string) {
    this._content = content;
  }

  static build(content: string) {
    return new OutputBuilder(content);
  }

  appendFirestoreMatchers(_events: FirestoreEvent[]) {
    const imports =
      "import { FirestoreEvent, getFirestoreMatchers } from '@e2e/utils/firestore-matchers';";
    const matchers =
      "const { enableFirestoreMatcher, readDoc, readCollection, createDoc, updateDoc, deleteDoc } = getFirestoreMatchers(page, events);\n  enableFirestoreMatcher();\n";
    const content = this._content.replace(
      /(test\('test',\sasync\s\({\spage\s}\)\s=>\s{\n)/gm,
      `$1  ${matchers}`
    );
    const events = `const events = ${JSON.stringify(
      _events,
      stringifyReplacer
    )} as FirestoreEvent[];\n`;
    return new OutputBuilder([imports, content, events].join("\n"));
  }

  replaceAuthRecord(auth: string) {
    return new OutputBuilder(
      this._content.replace(
        /(await\spage.getByLabel\('JWT'\).fill\()('.+')(\);)$/gm,
        `$1process.env.${auth.toUpperCase()}_USER_TOKEN as string$3`
      )
    );
  }

  replaceFirestoreRecords(events: FirestoreEvent[]) {
    const firestoreRecordReplacer = (match: string, index: number) => {
      const { type, path } = events[index];
      switch (type) {
        case "READ_DOC":
          return `readDoc(${index}, "${path}");`;
        case "READ_COLLECTION":
          return `readCollection(${index}, "${path}");`;
        case "CREATE_DOC":
          return `createDoc(${index}, "${path}"');`;
        case "UPDATE_DOC":
          return `updateDoc(${index}, "${path}");`;
        case "DELETE_DOC":
          return `deleteDoc(${index}, "${path}");`;
        default:
          throw new Error(`Unsupported firestore event type: ${type}`);
      }
    };
    return new OutputBuilder(
      this._content.replaceAll(
        /await\spage\.getByLabel\('__recordFirestoreEvent-(\d+)'\).fill\('.+'\);$/gm,
        firestoreRecordReplacer
      )
    );
  }

  getContent() {
    return this._content;
  }
}

const stringifyReplacer = (key: string, value: any) => {
  console.log(key, value);
  return value;
};
