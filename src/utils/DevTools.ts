import { NODE_ENV } from "@src/constants/env";

type FirestoreEventType =
  | "READ_DOC"
  | "READ_COLLECTION"
  | "CREATE_DOC"
  | "UPDATE_DOC"
  | "DELETE_DOC";

type FirestoreEvent = {
  type: FirestoreEventType;
  path: string;
  data?: any;
};

export class DevTools {
  static async recordEvent({ type, path, data }: FirestoreEvent) {
    if (NODE_ENV === "production") return;

    (window as any).__firestore_recorder ||= [];
    (window as any).__firestore_recorder.push({ type, path, data });

    let recorder: (...args: Parameters<typeof DevTools.recordEvent>) => void;

    if (NODE_ENV === "development") {
      recorder = console.log;
    }
    if (NODE_ENV === "test") {
      recorder = TestGeneratorRecorder.recordEvent;
    }
    recorder!({ type, path, data });
  }
}
export class TestGeneratorRecorder {
  private static _instance: Promise<TestGeneratorRecorder | null> | null =
    NODE_ENV === "test" ? TestGeneratorRecorder.init() : null;

  private _events: FirestoreEvent[];
  private _limiter: any;
  private _onMessageHandler:
    | ((event: FirestoreEvent & { index: number }) => Promise<void>)
    | null = null;

  private constructor(
    onMessageHandler: (
      event: FirestoreEvent & { index: number }
    ) => Promise<void>,
    events: FirestoreEvent[],
    limiter: any
  ) {
    this._onMessageHandler = onMessageHandler;
    this._events = events;
    this._limiter = limiter;
  }
  static async init() {
    if (NODE_ENV !== "test") return null;

    const Bottleneck = (await import("bottleneck")).default;
    console.log("Firestore recorder initiated");
    const onMessageHandler = (event: FirestoreEvent & { index: number }) => {
      const playwrightRecorder = (window as any).__pw_recorderRecordAction;
      if (!playwrightRecorder) {
        throw new Error("Playwright recorder not found");
      }
      playwrightRecorder({
        name: "fill",
        selector: `internal:label="__recordFirestoreEvent-${event.index}"i`,
        signals: [],
        text: `${event.type}, ${event.path}`,
      });
      return Promise.resolve();
    };

    return new TestGeneratorRecorder(
      onMessageHandler,
      [],
      new Bottleneck({ maxConcurrent: 1 })
    );
  }

  static async recordEvent(event: FirestoreEvent) {
    if (!TestGeneratorRecorder._instance) {
      throw new Error("TestGeneratorRecorder instance did not initiated");
    }
    const instance = await TestGeneratorRecorder._instance;

    if (!instance || !instance._onMessageHandler || !instance._limiter) {
      throw new Error("Something went wrong");
    }

    await instance._limiter.schedule(() => {
      console.log(event.type, event.path, { event, events: instance._events });

      instance._events.push(event);

      return instance._onMessageHandler!({
        index: instance._events.length - 1,
        ...event,
      });
    });
  }
}
