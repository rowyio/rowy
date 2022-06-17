/* eslint-disable tsdoc/syntax */
/**
 * @fileoverview Firestore Server API.
 *
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// tslint:disable

// Declare a global (ambient) namespace
// (used when not using import statement, but just script include).
declare namespace FirebaseFirestore {
  /**
   * Document data (for use with `DocumentReference.set()`) consists of fields
   * mapped to values.
   */
  export type DocumentData = { [field: string]: any };

  /**
   * Update data (for use with `DocumentReference.update()`) consists of field
   * paths (e.g. 'foo' or 'foo.baz') mapped to values. Fields that contain dots
   * reference nested fields within the document.
   */
  export type UpdateData = { [fieldPath: string]: any };

  /**
   * Sets or disables the log function for all active Firestore instances.
   *
   * @param logger A log function that takes a message (such as `console.log`) or
   * `null` to turn off logging.
   */
  function setLogFunction(logger: ((msg: string) => void) | null): void;

  /**
   * Converter used by `withConverter()` to transform user objects of type T
   * into Firestore data.
   *
   * Using the converter allows you to specify generic type arguments when
   * storing and retrieving objects from Firestore.
   *
   * @example
   * class Post {
   *   constructor(readonly title: string, readonly author: string) {}
   *
   *   toString(): string {
   *     return this.title + ', by ' + this.author;
   *   }
   * }
   *
   * const postConverter = {
   *   toFirestore(post: Post): FirebaseFirestore.DocumentData {
   *     return {title: post.title, author: post.author};
   *   },
   *   fromFirestore(
   *     data: FirebaseFirestore.DocumentData
   *   ): Post {
   *     return new Post(data.title, data.author);
   *   }
   * };
   *
   * const postSnap = await Firestore()
   *   .collection('posts')
   *   .withConverter(postConverter)
   *   .doc().get();
   * const post = postSnap.data();
   * if (post !== undefined) {
   *   post.title; // string
   *   post.toString(); // Should be defined
   *   post.someNonExistentProperty; // TS error
   * }
   */
  export interface FirestoreDataConverter<T> {
    /**
     * Called by the Firestore SDK to convert a custom model object of type T
     * into a plain Javascript object (suitable for writing directly to the
     * Firestore database).
     */
    toFirestore(modelObject: T): DocumentData;

    /**
     * Called by the Firestore SDK to convert Firestore data into an object of
     * type T.
     */
    fromFirestore(data: DocumentData): T;
  }

  /**
   * Settings used to directly configure a `Firestore` instance.
   */
  export interface Settings {
    /**
     * The project ID from the Google Developer's Console, e.g.
     * 'grape-spaceship-123'. We will also check the environment variable
     * GCLOUD_PROJECT for your project ID.  Can be omitted in environments that
     * support {@link https://cloud.google.com/docs/authentication Application
     * Default Credentials}
     */
    projectId?: string;

    /** The hostname to connect to. */
    host?: string;

    /** The port to connect to. */
    port?: number;

    /**
     * Local file containing the Service Account credentials as downloaded from
     * the Google Developers Console. Can  be omitted in environments that
     * support {@link https://cloud.google.com/docs/authentication Application
     * Default Credentials}. To configure Firestore with custom credentials, use
     * the `credentials` property to provide the `client_email` and
     * `private_key` of your service account.
     */
    keyFilename?: string;

    /**
     * The 'client_email' and 'private_key' properties of the service account
     * to use with your Firestore project. Can be omitted in environments that
     * support {@link https://cloud.google.com/docs/authentication Application
     * Default Credentials}. If your credentials are stored in a JSON file, you
     * can specify a `keyFilename` instead.
     */
    credentials?: { client_email?: string; private_key?: string };

    /** Whether to use SSL when connecting. */
    ssl?: boolean;

    /**
     * The maximum number of idle GRPC channels to keep. A smaller number of idle
     * channels reduces memory usage but increases request latency for clients
     * with fluctuating request rates. If set to 0, shuts down all GRPC channels
     * when the client becomes idle. Defaults to 1.
     */
    maxIdleChannels?: number;

    [key: string]: any; // Accept other properties, such as GRPC settings.
  }

  /**
   * `Firestore` represents a Firestore Database and is the entry point for all
   * Firestore operations.
   */
  export class Firestore {
    /**
     * @param settings Configuration object. See [Firestore Documentation]
     * {@link https://firebase.google.com/docs/firestore/}
     */
    public constructor(settings?: Settings);

    /**
     * Specifies custom settings to be used to configure the `Firestore`
     * instance. Can only be invoked once and before any other Firestore
     * method.
     *
     * If settings are provided via both `settings()` and the `Firestore`
     * constructor, both settings objects are merged and any settings provided
     * via `settings()` take precedence.
     *
     * @param {object} settings The settings to use for all Firestore
     * operations.
     */
    settings(settings: Settings): void;

    /**
     * Gets a `CollectionReference` instance that refers to the collection at
     * the specified path.
     *
     * @param collectionPath A slash-separated path to a collection.
     * @return The `CollectionReference` instance.
     */
    collection(collectionPath: string): CollectionReference<DocumentData>;

    /**
     * Gets a `DocumentReference` instance that refers to the document at the
     * specified path.
     *
     * @param documentPath A slash-separated path to a document.
     * @return The `DocumentReference` instance.
     */
    doc(documentPath: string): DocumentReference<DocumentData>;

    /**
     * Creates and returns a new Query that includes all documents in the
     * database that are contained in a collection or subcollection with the
     * given collectionId.
     *
     * @param collectionId Identifies the collections to query over. Every
     * collection or subcollection with this ID as the last segment of its path
     * will be included. Cannot contain a slash.
     * @return The created Query.
     */
    collectionGroup(collectionId: string): Query<DocumentData>;

    /**
     * Retrieves multiple documents from Firestore.
     *
     * The first argument is required and must be of type `DocumentReference`
     * followed by any additional `DocumentReference` documents. If used, the
     * optional `ReadOptions` must be the last argument.
     *
     * @param {Array.<DocumentReference|ReadOptions>} documentRefsOrReadOptions
     * The `DocumentReferences` to receive, followed by an optional field
     * mask.
     * @return A Promise that resolves with an array of resulting document
     * snapshots.
     */
    getAll(
      ...documentRefsOrReadOptions: Array<
        DocumentReference<DocumentData> | ReadOptions
      >
    ): Promise<Array<DocumentSnapshot<DocumentData>>>;

    /**
     * Terminates the Firestore client and closes all open streams.
     *
     * @return A Promise that resolves when the client is terminated.
     */
    terminate(): Promise<void>;

    /**
     * Fetches the root collections that are associated with this Firestore
     * database.
     *
     * @returns A Promise that resolves with an array of CollectionReferences.
     */
    listCollections(): Promise<Array<CollectionReference<DocumentData>>>;

    /**
     * Executes the given updateFunction and commits the changes applied within
     * the transaction.
     *
     * You can use the transaction object passed to 'updateFunction' to read and
     * modify Firestore documents under lock. Transactions are committed once
     * 'updateFunction' resolves and attempted up to five times on failure.
     *
     * @param updateFunction The function to execute within the transaction
     * context.
     * @param {object=} transactionOptions Transaction options.
     * @param {number=} transactionOptions.maxAttempts The maximum number of
     * attempts for this transaction.
     * @return If the transaction completed successfully or was explicitly
     * aborted (by the updateFunction returning a failed Promise), the Promise
     * returned by the updateFunction will be returned here. Else if the
     * transaction failed, a rejected Promise with the corresponding failure
     * error will be returned.
     */
    runTransaction<T>(
      updateFunction: (transaction: Transaction) => Promise<T>,
      transactionOptions?: { maxAttempts?: number }
    ): Promise<T>;

    /**
     * Creates a write batch, used for performing multiple writes as a single
     * atomic operation.
     */
    batch(): WriteBatch;
  }

  /**
   * An immutable object representing a geo point in Firestore. The geo point
   * is represented as latitude/longitude pair.
   *
   * Latitude values are in the range of [-90, 90].
   * Longitude values are in the range of [-180, 180].
   */
  export class GeoPoint {
    /**
     * Creates a new immutable GeoPoint object with the provided latitude and
     * longitude values.
     * @param latitude The latitude as number between -90 and 90.
     * @param longitude The longitude as number between -180 and 180.
     */
    constructor(latitude: number, longitude: number);

    readonly latitude: number;
    readonly longitude: number;

    /**
     * Returns true if this `GeoPoint` is equal to the provided one.
     *
     * @param other The `GeoPoint` to compare against.
     * @return true if this `GeoPoint` is equal to the provided one.
     */
    isEqual(other: GeoPoint): boolean;
  }

  /**
   * A reference to a transaction.
   * The `Transaction` object passed to a transaction's updateFunction provides
   * the methods to read and write data within the transaction context. See
   * `Firestore.runTransaction()`.
   */
  export class Transaction {
    private constructor();

    /**
     * Retrieves a query result. Holds a pessimistic lock on all returned
     * documents.
     *
     * @param query A query to execute.
     * @return A QuerySnapshot for the retrieved data.
     */
    get<T>(query: Query<T>): Promise<QuerySnapshot<T>>;

    /**
     * Reads the document referenced by the provided `DocumentReference.`
     * Holds a pessimistic lock on the returned document.
     *
     * @param documentRef A reference to the document to be read.
     * @return A DocumentSnapshot for the read data.
     */
    get<T>(documentRef: DocumentReference<T>): Promise<DocumentSnapshot<T>>;

    /**
     * Retrieves multiple documents from Firestore. Holds a pessimistic lock on
     * all returned documents.
     *
     * The first argument is required and must be of type `DocumentReference`
     * followed by any additional `DocumentReference` documents. If used, the
     * optional `ReadOptions` must be the last argument.
     *
     * @param {Array.<DocumentReference|ReadOptions>} documentRefsOrReadOptions
     * The `DocumentReferences` to receive, followed by an optional field
     * mask.
     * @return A Promise that resolves with an array of resulting document
     * snapshots.
     */
    getAll<T>(
      ...documentRefsOrReadOptions: Array<DocumentReference | ReadOptions>
    ): Promise<Array<DocumentSnapshot<T>>>;

    /**
     * Create the document referred to by the provided `DocumentReference`.
     * The operation will fail the transaction if a document exists at the
     * specified location.
     *
     * @param documentRef A reference to the document to be create.
     * @param data The object data to serialize as the document.
     * @return This `Transaction` instance. Used for chaining method calls.
     */
    create<T>(documentRef: DocumentReference<T>, data: T): Transaction;

    /**
     * Writes to the document referred to by the provided `DocumentReference`.
     * If the document does not exist yet, it will be created. If you pass
     * `SetOptions`, the provided data can be merged into the existing document.
     *
     * @param documentRef A reference to the document to be set.
     * @param data An object of the fields and values for the document.
     * @param options An object to configure the set behavior.
     * @return This `Transaction` instance. Used for chaining method calls.
     */
    set<T>(
      documentRef: DocumentReference<T>,
      data: T,
      options?: SetOptions
    ): Transaction;

    /**
     * Updates fields in the document referred to by the provided
     * `DocumentReference`. The update will fail if applied to a document that
     * does not exist.
     *
     * Nested fields can be updated by providing dot-separated field path
     * strings.
     *
     * @param documentRef A reference to the document to be updated.
     * @param data An object containing the fields and values with which to
     * update the document.
     * @param precondition A Precondition to enforce on this update.
     * @return This `Transaction` instance. Used for chaining method calls.
     */
    update(
      documentRef: DocumentReference<any>,
      data: UpdateData,
      precondition?: Precondition
    ): Transaction;

    /**
     * Updates fields in the document referred to by the provided
     * `DocumentReference`. The update will fail if applied to a document that
     * does not exist.
     *
     * Nested fields can be updated by providing dot-separated field path
     * strings or by providing FieldPath objects.
     *
     * A `Precondition` restricting this update can be specified as the last
     * argument.
     *
     * @param documentRef A reference to the document to be updated.
     * @param field The first field to update.
     * @param value The first value
     * @param fieldsOrPrecondition An alternating list of field paths and values
     * to update, optionally followed by a `Precondition` to enforce on this
     * update.
     * @return This `Transaction` instance. Used for chaining method calls.
     */
    update(
      documentRef: DocumentReference<any>,
      field: string | FieldPath,
      value: any,
      ...fieldsOrPrecondition: any[]
    ): Transaction;

    /**
     * Deletes the document referred to by the provided `DocumentReference`.
     *
     * @param documentRef A reference to the document to be deleted.
     * @param precondition A Precondition to enforce for this delete.
     * @return This `Transaction` instance. Used for chaining method calls.
     */
    delete(
      documentRef: DocumentReference<any>,
      precondition?: Precondition
    ): Transaction;
  }

  /**
   * A write batch, used to perform multiple writes as a single atomic unit.
   *
   * A `WriteBatch` object can be acquired by calling `Firestore.batch()`. It
   * provides methods for adding writes to the write batch. None of the
   * writes will be committed (or visible locally) until `WriteBatch.commit()`
   * is called.
   *
   * Unlike transactions, write batches are persisted offline and therefore are
   * preferable when you don't need to condition your writes on read data.
   */
  export class WriteBatch {
    private constructor();

    /**
     * Create the document referred to by the provided `DocumentReference`. The
     * operation will fail the batch if a document exists at the specified
     * location.
     *
     * @param documentRef A reference to the document to be created.
     * @param data The object data to serialize as the document.
     * @return This `WriteBatch` instance. Used for chaining method calls.
     */
    create<T>(documentRef: DocumentReference<T>, data: T): WriteBatch;

    /**
     * Write to the document referred to by the provided `DocumentReference`.
     * If the document does not exist yet, it will be created. If you pass
     * `SetOptions`, the provided data can be merged into the existing document.
     *
     * @param documentRef A reference to the document to be set.
     * @param data An object of the fields and values for the document.
     * @param options An object to configure the set behavior.
     * @return This `WriteBatch` instance. Used for chaining method calls.
     */
    set<T>(
      documentRef: DocumentReference<T>,
      data: T,
      options?: SetOptions
    ): WriteBatch;

    /**
     * Update fields of the document referred to by the provided
     * `DocumentReference`. If the document doesn't yet exist, the update fails
     * and the entire batch will be rejected.
     *
     * Nested fields can be updated by providing dot-separated field path
     * strings.
     *
     * @param documentRef A reference to the document to be updated.
     * @param data An object containing the fields and values with which to
     * update the document.
     * @param precondition A Precondition to enforce on this update.
     * @return This `WriteBatch` instance. Used for chaining method calls.
     */
    update(
      documentRef: DocumentReference<any>,
      data: UpdateData,
      precondition?: Precondition
    ): WriteBatch;

    /**
     * Updates fields in the document referred to by the provided
     * `DocumentReference`. The update will fail if applied to a document that
     * does not exist.
     *
     * Nested fields can be updated by providing dot-separated field path
     * strings or by providing FieldPath objects.
     *
     * A `Precondition` restricting this update can be specified as the last
     * argument.
     *
     * @param documentRef A reference to the document to be updated.
     * @param field The first field to update.
     * @param value The first value
     * @param fieldsOrPrecondition An alternating list of field paths and values
     * to update, optionally followed a `Precondition` to enforce on this update.
     * @return This `WriteBatch` instance. Used for chaining method calls.
     */
    update(
      documentRef: DocumentReference<any>,
      field: string | FieldPath,
      value: any,
      ...fieldsOrPrecondition: any[]
    ): WriteBatch;

    /**
     * Deletes the document referred to by the provided `DocumentReference`.
     *
     * @param documentRef A reference to the document to be deleted.
     * @param precondition A Precondition to enforce for this delete.
     * @return This `WriteBatch` instance. Used for chaining method calls.
     */
    delete(
      documentRef: DocumentReference<any>,
      precondition?: Precondition
    ): WriteBatch;

    /**
     * Commits all of the writes in this write batch as a single atomic unit.
     *
     * @return A Promise resolved once all of the writes in the batch have been
     * successfully written to the backend as an atomic unit.
     */
    commit(): Promise<WriteResult[]>;
  }

  /**
   * An options object that configures conditional behavior of `update()` and
   * `delete()` calls in `DocumentReference`, `WriteBatch`, and `Transaction`.
   * Using Preconditions, these calls can be restricted to only apply to
   * documents that match the specified restrictions.
   */
  export interface Precondition {
    /**
     * If set, the last update time to enforce.
     */
    readonly lastUpdateTime?: Timestamp;
  }

  /**
   * An options object that configures the behavior of `set()` calls in
   * `DocumentReference`, `WriteBatch` and `Transaction`. These calls can be
   * configured to perform granular merges instead of overwriting the target
   * documents in their entirety.
   */
  export interface SetOptions {
    /**
     * Changes the behavior of a set() call to only replace the values specified
     * in its data argument. Fields omitted from the set() call remain
     * untouched.
     */
    readonly merge?: boolean;

    /**
     * Changes the behavior of set() calls to only replace the specified field
     * paths. Any field path that is not specified is ignored and remains
     * untouched.
     *
     * It is an error to pass a SetOptions object to a set() call that is
     * missing a value for any of the fields specified here.
     */
    readonly mergeFields?: (string | FieldPath)[];
  }

  /**
   * An options object that can be used to configure the behavior of `getAll()`
   * calls. By providing a `fieldMask`, these calls can be configured to only
   * return a subset of fields.
   */
  export interface ReadOptions {
    /**
     * Specifies the set of fields to return and reduces the amount of data
     * transmitted by the backend.
     *
     * Adding a field mask does not filter results. Documents do not need to
     * contain values for all the fields in the mask to be part of the result
     * set.
     */
    readonly fieldMask?: (string | FieldPath)[];
  }

  /**
   * A WriteResult wraps the write time set by the Firestore servers on `sets()`,
   * `updates()`, and `creates()`.
   */
  export class WriteResult {
    private constructor();

    /**
     * The write time as set by the Firestore servers.
     */
    readonly writeTime: Timestamp;

    /**
     * Returns true if this `WriteResult` is equal to the provided one.
     *
     * @param other The `WriteResult` to compare against.
     * @return true if this `WriteResult` is equal to the provided one.
     */
    isEqual(other: WriteResult): boolean;
  }

  /**
   * A `DocumentReference` refers to a document location in a Firestore database
   * and can be used to write, read, or listen to the location. The document at
   * the referenced location may or may not exist. A `DocumentReference` can
   * also be used to create a `CollectionReference` to a subcollection.
   */
  export class DocumentReference<T = DocumentData> {
    private constructor();

    /** The identifier of the document within its collection. */
    readonly id: string;

    /**
     * The `Firestore` for the Firestore database (useful for performing
     * transactions, etc.).
     */
    readonly firestore: Firestore;
    readonly db: Firestore;

    /**
     * A reference to the Collection to which this DocumentReference belongs.
     */
    readonly parent: CollectionReference<T>;

    /**
     * A string representing the path of the referenced document (relative
     * to the root of the database).
     */
    readonly path: string;

    /**
     * Gets a `CollectionReference` instance that refers to the collection at
     * the specified path.
     *
     * @param collectionPath A slash-separated path to a collection.
     * @return The `CollectionReference` instance.
     */
    collection(collectionPath: string): CollectionReference<DocumentData>;

    /**
     * Fetches the subcollections that are direct children of this document.
     *
     * @returns A Promise that resolves with an array of CollectionReferences.
     */
    listCollections(): Promise<Array<CollectionReference<DocumentData>>>;

    /**
     * Creates a document referred to by this `DocumentReference` with the
     * provided object values. The write fails if the document already exists
     *
     * @param data The object data to serialize as the document.
     * @return A Promise resolved with the write time of this create.
     */
    create(data: T): Promise<WriteResult>;

    /**
     * Writes to the document referred to by this `DocumentReference`. If the
     * document does not yet exist, it will be created. If you pass
     * `SetOptions`, the provided data can be merged into an existing document.
     *
     * @param data A map of the fields and values for the document.
     * @param options An object to configure the set behavior.
     * @return A Promise resolved with the write time of this set.
     */
    set(data: T, options?: SetOptions): Promise<WriteResult>;

    /**
     * Updates fields in the document referred to by this `DocumentReference`.
     * The update will fail if applied to a document that does not exist.
     *
     * Nested fields can be updated by providing dot-separated field path
     * strings.
     *
     * @param data An object containing the fields and values with which to
     * update the document.
     * @param precondition A Precondition to enforce on this update.
     * @return A Promise resolved with the write time of this update.
     */
    update(data: UpdateData, precondition?: Precondition): Promise<WriteResult>;

    /**
     * Updates fields in the document referred to by this `DocumentReference`.
     * The update will fail if applied to a document that does not exist.
     *
     * Nested fields can be updated by providing dot-separated field path
     * strings or by providing FieldPath objects.
     *
     * A `Precondition` restricting this update can be specified as the last
     * argument.
     *
     * @param field The first field to update.
     * @param value The first value.
     * @param moreFieldsOrPrecondition An alternating list of field paths and
     * values to update, optionally followed by a `Precondition` to enforce on
     * this update.
     * @return A Promise resolved with the write time of this update.
     */
    update(
      field: string | FieldPath,
      value: any,
      ...moreFieldsOrPrecondition: any[]
    ): Promise<WriteResult>;

    /**
     * Deletes the document referred to by this `DocumentReference`.
     *
     * @param precondition A Precondition to enforce for this delete.
     * @return A Promise resolved with the write time of this delete.
     */
    delete(precondition?: Precondition): Promise<WriteResult>;

    /**
     * Reads the document referred to by this `DocumentReference`.
     *
     * @return A Promise resolved with a DocumentSnapshot containing the
     * current document contents.
     */
    get(): Promise<DocumentSnapshot<T>>;

    /**
     * Attaches a listener for DocumentSnapshot events.
     *
     * @param onNext A callback to be called every time a new `DocumentSnapshot`
     * is available.
     * @param onError A callback to be called if the listen fails or is
     * cancelled. No further callbacks will occur.
     * @return An unsubscribe function that can be called to cancel
     * the snapshot listener.
     */
    onSnapshot(
      onNext: (snapshot: DocumentSnapshot<T>) => void,
      onError?: (error: Error) => void
    ): () => void;

    /**
     * Returns true if this `DocumentReference` is equal to the provided one.
     *
     * @param other The `DocumentReference` to compare against.
     * @return true if this `DocumentReference` is equal to the provided one.
     */
    isEqual(other: DocumentReference<T>): boolean;

    /**
     * Applies a custom data converter to this DocumentReference, allowing you
     * to use your own custom model objects with Firestore. When you call
     * set(), get(), etc. on the returned DocumentReference instance, the
     * provided converter will convert between Firestore data and your custom
     * type U.
     *
     * @param converter Converts objects to and from Firestore.
     * @return A DocumentReference<U> that uses the provided converter.
     */
    withConverter<U>(
      converter: FirestoreDataConverter<U>
    ): DocumentReference<U>;
  }

  /**
   * A `DocumentSnapshot` contains data read from a document in your Firestore
   * database. The data can be extracted with `.data()` or `.get(<field>)` to
   * get a specific field.
   *
   * For a `DocumentSnapshot` that points to a non-existing document, any data
   * access will return 'undefined'. You can use the `exists` property to
   * explicitly verify a document's existence.
   */
  export class DocumentSnapshot<T = DocumentData> {
    protected constructor();

    /** True if the document exists. */
    readonly exists: boolean;

    /** A `DocumentReference` to the document location. */
    readonly ref: DocumentReference<T>;

    /**
     * The ID of the document for which this `DocumentSnapshot` contains data.
     */
    readonly id: string;

    /**
     * The time the document was created. Not set for documents that don't
     * exist.
     */
    readonly createTime?: Timestamp;

    /**
     * The time the document was last updated (at the time the snapshot was
     * generated). Not set for documents that don't exist.
     */
    readonly updateTime?: Timestamp;

    /**
     * The time this snapshot was read.
     */
    readonly readTime: Timestamp;

    /**
     * Retrieves all fields in the document as an Object. Returns 'undefined' if
     * the document doesn't exist.
     *
     * @return An Object containing all fields in the document.
     */
    data(): T | undefined;

    /**
     * Retrieves the field specified by `fieldPath`.
     *
     * @param fieldPath The path (e.g. 'foo' or 'foo.bar') to a specific field.
     * @return The data at the specified field location or undefined if no such
     * field exists in the document.
     */
    get(fieldPath: string | FieldPath): any;

    /**
     * Returns true if the document's data and path in this `DocumentSnapshot`
     * is equal to the provided one.
     *
     * @param other The `DocumentSnapshot` to compare against.
     * @return true if this `DocumentSnapshot` is equal to the provided one.
     */
    isEqual(other: DocumentSnapshot<T>): boolean;
  }

  /**
   * A `QueryDocumentSnapshot` contains data read from a document in your
   * Firestore database as part of a query. The document is guaranteed to exist
   * and its data can be extracted with `.data()` or `.get(<field>)` to get a
   * specific field.
   *
   * A `QueryDocumentSnapshot` offers the same API surface as a
   * `DocumentSnapshot`. Since query results contain only existing documents, the
   * `exists` property will always be true and `data()` will never return
   * 'undefined'.
   */
  export class QueryDocumentSnapshot<
    T = DocumentData
  > extends DocumentSnapshot<T> {
    private constructor();

    /**
     * The time the document was created.
     */
    readonly createTime: Timestamp;

    /**
     * The time the document was last updated (at the time the snapshot was
     * generated).
     */
    readonly updateTime: Timestamp;

    /**
     * Retrieves all fields in the document as an Object.
     *
     * @override
     * @return An Object containing all fields in the document.
     */
    data(): T;
  }

  /**
   * The direction of a `Query.orderBy()` clause is specified as 'desc' or 'asc'
   * (descending or ascending).
   */
  export type OrderByDirection = "desc" | "asc";

  /**
   * Filter conditions in a `Query.where()` clause are specified using the
   * strings '<', '<=', '==', '>=', '>', 'array-contains', 'in', and
   * 'array-contains-any'.
   */
  export type WhereFilterOp =
    | "<"
    | "<="
    | "=="
    | ">="
    | ">"
    | "array-contains"
    | "in"
    | "array-contains-any";

  /**
   * A `Query` refers to a Query which you can read or listen to. You can also
   * construct refined `Query` objects by adding filters and ordering.
   */
  export class Query<T = DocumentData> {
    protected constructor();

    /**
     * The `Firestore` for the Firestore database (useful for performing
     * transactions, etc.).
     */
    readonly firestore: Firestore;
    readonly db: Firestore;

    /**
     * Creates and returns a new Query with the additional filter that documents
     * must contain the specified field and that its value should satisfy the
     * relation constraint provided.
     *
     * This function returns a new (immutable) instance of the Query (rather
     * than modify the existing instance) to impose the filter.
     *
     * @param fieldPath The path to compare
     * @param opStr The operation string (e.g "<", "<=", "==", ">", ">=").
     * @param value The value for comparison
     * @return The created Query.
     */
    where(
      fieldPath: string | FieldPath,
      opStr: WhereFilterOp,
      value: any
    ): Query<T>;

    /**
     * Creates and returns a new Query that's additionally sorted by the
     * specified field, optionally in descending order instead of ascending.
     *
     * This function returns a new (immutable) instance of the Query (rather
     * than modify the existing instance) to impose the order.
     *
     * @param fieldPath The field to sort by.
     * @param directionStr Optional direction to sort by ('asc' or 'desc'). If
     * not specified, order will be ascending.
     * @return The created Query.
     */
    orderBy(
      fieldPath: string | FieldPath,
      directionStr?: OrderByDirection
    ): Query<T>;

    /**
     * Creates and returns a new Query that only returns the first matching
     * documents.
     *
     * This function returns a new (immutable) instance of the Query (rather
     * than modify the existing instance) to impose the limit.
     *
     * @param limit The maximum number of items to return.
     * @return The created Query.
     */
    limit(limit: number): Query<T>;

    /**
     * Creates and returns a new Query that only returns the last matching
     * documents.
     *
     * You must specify at least one orderBy clause for limitToLast queries,
     * otherwise an exception will be thrown during execution.
     *
     * Results for limitToLast queries cannot be streamed via the `stream()`
     * API.
     *
     * @param limit The maximum number of items to return.
     * @return The created Query.
     */
    limitToLast(limit: number): Query<T>;

    /**
     * Specifies the offset of the returned results.
     *
     * This function returns a new (immutable) instance of the Query (rather
     * than modify the existing instance) to impose the offset.
     *
     * @param offset The offset to apply to the Query results.
     * @return The created Query.
     */
    offset(offset: number): Query<T>;

    /**
     * Creates and returns a new Query instance that applies a field mask to
     * the result and returns only the specified subset of fields. You can
     * specify a list of field paths to return, or use an empty list to only
     * return the references of matching documents.
     *
     * This function returns a new (immutable) instance of the Query (rather
     * than modify the existing instance) to impose the field mask.
     *
     * @param field The field paths to return.
     * @return The created Query.
     */
    select(...field: (string | FieldPath)[]): Query<T>;

    /**
     * Creates and returns a new Query that starts at the provided document
     * (inclusive). The starting position is relative to the order of the query.
     * The document must contain all of the fields provided in the orderBy of
     * this query.
     *
     * @param snapshot The snapshot of the document to start after.
     * @return The created Query.
     */
    startAt(snapshot: DocumentSnapshot<any>): Query<T>;

    /**
     * Creates and returns a new Query that starts at the provided fields
     * relative to the order of the query. The order of the field values
     * must match the order of the order by clauses of the query.
     *
     * @param fieldValues The field values to start this query at, in order
     * of the query's order by.
     * @return The created Query.
     */
    startAt(...fieldValues: any[]): Query<T>;

    /**
     * Creates and returns a new Query that starts after the provided document
     * (exclusive). The starting position is relative to the order of the query.
     * The document must contain all of the fields provided in the orderBy of
     * this query.
     *
     * @param snapshot The snapshot of the document to start after.
     * @return The created Query.
     */
    startAfter(snapshot: DocumentSnapshot<any>): Query<T>;

    /**
     * Creates and returns a new Query that starts after the provided fields
     * relative to the order of the query. The order of the field values
     * must match the order of the order by clauses of the query.
     *
     * @param fieldValues The field values to start this query after, in order
     * of the query's order by.
     * @return The created Query.
     */
    startAfter(...fieldValues: any[]): Query<T>;

    /**
     * Creates and returns a new Query that ends before the provided document
     * (exclusive). The end position is relative to the order of the query. The
     * document must contain all of the fields provided in the orderBy of this
     * query.
     *
     * @param snapshot The snapshot of the document to end before.
     * @return The created Query.
     */
    endBefore(snapshot: DocumentSnapshot<any>): Query<T>;

    /**
     * Creates and returns a new Query that ends before the provided fields
     * relative to the order of the query. The order of the field values
     * must match the order of the order by clauses of the query.
     *
     * @param fieldValues The field values to end this query before, in order
     * of the query's order by.
     * @return The created Query.
     */
    endBefore(...fieldValues: any[]): Query<T>;

    /**
     * Creates and returns a new Query that ends at the provided document
     * (inclusive). The end position is relative to the order of the query. The
     * document must contain all of the fields provided in the orderBy of this
     * query.
     *
     * @param snapshot The snapshot of the document to end at.
     * @return The created Query.
     */
    endAt(snapshot: DocumentSnapshot<any>): Query<T>;

    /**
     * Creates and returns a new Query that ends at the provided fields
     * relative to the order of the query. The order of the field values
     * must match the order of the order by clauses of the query.
     *
     * @param fieldValues The field values to end this query at, in order
     * of the query's order by.
     * @return The created Query.
     */
    endAt(...fieldValues: any[]): Query<T>;

    /**
     * Executes the query and returns the results as a `QuerySnapshot`.
     *
     * @return A Promise that will be resolved with the results of the Query.
     */
    get(): Promise<QuerySnapshot<T>>;

    /*
     * Executes the query and returns the results as Node Stream.
     *
     * @return A stream of QueryDocumentSnapshot.
     */
    stream(): NodeJS.ReadableStream;

    /**
     * Attaches a listener for `QuerySnapshot `events.
     *
     * @param onNext A callback to be called every time a new `QuerySnapshot`
     * is available.
     * @param onError A callback to be called if the listen fails or is
     * cancelled. No further callbacks will occur.
     * @return An unsubscribe function that can be called to cancel
     * the snapshot listener.
     */
    onSnapshot(
      onNext: (snapshot: QuerySnapshot<T>) => void,
      onError?: (error: Error) => void
    ): () => void;

    /**
     * Returns true if this `Query` is equal to the provided one.
     *
     * @param other The `Query` to compare against.
     * @return true if this `Query` is equal to the provided one.
     */
    isEqual(other: Query<T>): boolean;

    /**
     * Applies a custom data converter to this Query, allowing you to use your
     * own custom model objects with Firestore. When you call get() on the
     * returned Query, the provided converter will convert between Firestore
     * data and your custom type U.
     *
     * @param converter Converts objects to and from Firestore.
     * @return A Query<U> that uses the provided converter.
     */
    withConverter<U>(converter: FirestoreDataConverter<U>): Query<U>;
  }

  /**
   * A `QuerySnapshot` contains zero or more `QueryDocumentSnapshot` objects
   * representing the results of a query. The documents can be accessed as an
   * array via the `docs` property or enumerated using the `forEach` method. The
   * number of documents can be determined via the `empty` and `size`
   * properties.
   */
  export class QuerySnapshot<T = DocumentData> {
    private constructor();

    /**
     * The query on which you called `get` or `onSnapshot` in order to get this
     * `QuerySnapshot`.
     */
    readonly query: Query<T>;

    /** An array of all the documents in the QuerySnapshot. */
    readonly docs: Array<QueryDocumentSnapshot<T>>;

    /** The number of documents in the QuerySnapshot. */
    readonly size: number;

    /** True if there are no documents in the QuerySnapshot. */
    readonly empty: boolean;

    /** The time this query snapshot was obtained. */
    readonly readTime: Timestamp;

    /**
     * Returns an array of the documents changes since the last snapshot. If
     * this is the first snapshot, all documents will be in the list as added
     * changes.
     */
    docChanges(): DocumentChange[];

    /**
     * Enumerates all of the documents in the QuerySnapshot.
     *
     * @param callback A callback to be called with a `DocumentSnapshot` for
     * each document in the snapshot.
     * @param thisArg The `this` binding for the callback.
     */
    forEach(
      callback: (result: QueryDocumentSnapshot<T>) => void,
      thisArg?: any
    ): void;

    /**
     * Returns true if the document data in this `QuerySnapshot` is equal to the
     * provided one.
     *
     * @param other The `QuerySnapshot` to compare against.
     * @return true if this `QuerySnapshot` is equal to the provided one.
     */
    isEqual(other: QuerySnapshot<T>): boolean;
  }

  /**
   * The type of of a `DocumentChange` may be 'added', 'removed', or 'modified'.
   */
  export type DocumentChangeType = "added" | "removed" | "modified";

  /**
   * A `DocumentChange` represents a change to the documents matching a query.
   * It contains the document affected and the type of change that occurred.
   */
  export interface DocumentChange<T = DocumentData> {
    /** The type of change ('added', 'modified', or 'removed'). */
    readonly type: DocumentChangeType;

    /** The document affected by this change. */
    readonly doc: QueryDocumentSnapshot<T>;

    /**
     * The index of the changed document in the result set immediately prior to
     * this DocumentChange (i.e. supposing that all prior DocumentChange objects
     * have been applied). Is -1 for 'added' events.
     */
    readonly oldIndex: number;

    /**
     * The index of the changed document in the result set immediately after
     * this DocumentChange (i.e. supposing that all prior DocumentChange
     * objects and the current DocumentChange object have been applied).
     * Is -1 for 'removed' events.
     */
    readonly newIndex: number;

    /**
     * Returns true if the data in this `DocumentChange` is equal to the
     * provided one.
     *
     * @param other The `DocumentChange` to compare against.
     * @return true if this `DocumentChange` is equal to the provided one.
     */
    isEqual(other: DocumentChange<T>): boolean;
  }

  /**
   * A `CollectionReference` object can be used for adding documents, getting
   * document references, and querying for documents (using the methods
   * inherited from `Query`).
   */
  export class CollectionReference<T = DocumentData> extends Query<T> {
    private constructor();

    /** The identifier of the collection. */
    readonly id: string;

    /**
     * A reference to the containing Document if this is a subcollection, else
     * null.
     */
    readonly parent: DocumentReference<DocumentData> | null;

    /**
     * A string representing the path of the referenced collection (relative
     * to the root of the database).
     */
    readonly path: string;

    /**
     * Retrieves the list of documents in this collection.
     *
     * The document references returned may include references to "missing
     * documents", i.e. document locations that have no document present but
     * which contain subcollections with documents. Attempting to read such a
     * document reference (e.g. via `.get()` or `.onSnapshot()`) will return a
     * `DocumentSnapshot` whose `.exists` property is false.
     *
     * @return {Promise<DocumentReference[]>} The list of documents in this
     * collection.
     */
    listDocuments(): Promise<Array<DocumentReference<T>>>;

    /**
     * Get a `DocumentReference` for a randomly-named document within this
     * collection. An automatically-generated unique ID will be used as the
     * document ID.
     *
     * @return The `DocumentReference` instance.
     */
    doc(): DocumentReference<T>;

    /**
     * Get a `DocumentReference` for the document within the collection at the
     * specified path.
     *
     * @param documentPath A slash-separated path to a document.
     * @return The `DocumentReference` instance.
     */
    doc(documentPath: string): DocumentReference<T>;

    /**
     * Add a new document to this collection with the specified data, assigning
     * it a document ID automatically.
     *
     * @param data An Object containing the data for the new document.
     * @return A Promise resolved with a `DocumentReference` pointing to the
     * newly created document after it has been written to the backend.
     */
    add(data: T): Promise<DocumentReference<T>>;

    /**
     * Returns true if this `CollectionReference` is equal to the provided one.
     *
     * @param other The `CollectionReference` to compare against.
     * @return true if this `CollectionReference` is equal to the provided one.
     */
    isEqual(other: CollectionReference<T>): boolean;

    /**
     * Applies a custom data converter to this CollectionReference, allowing you
     * to use your own custom model objects with Firestore. When you call add()
     * on the returned CollectionReference instance, the provided converter will
     * convert between Firestore data and your custom type U.
     *
     * @param converter Converts objects to and from Firestore.
     * @return A CollectionReference<U> that uses the provided converter.
     */
    withConverter<U>(
      converter: FirestoreDataConverter<U>
    ): CollectionReference<U>;
  }

  /**
   * Sentinel values that can be used when writing document fields with set(),
   * create() or update().
   */
  export class FieldValue {
    private constructor();

    /**
     * Returns a sentinel used with set(), create() or update() to include a
     * server-generated timestamp in the written data.
     *
     * @return The FieldValue sentinel for use in a call to set(), create() or
     * update().
     */
    static serverTimestamp(): FieldValue;

    /**
     * Returns a sentinel for use with update() or set() with {merge:true} to
     * mark a field for deletion.
     *
     * @return The FieldValue sentinel for use in a call to set() or update().
     */
    static delete(): FieldValue;

    /**
     * Returns a special value that can be used with set(), create() or update()
     * that tells the server to increment the field's current value by the given
     * value.
     *
     * If either current field value or the operand uses floating point
     * precision, both values will be interpreted as floating point numbers and
     * all arithmetic will follow IEEE 754 semantics. Otherwise, integer
     * precision is kept and the result is capped between -2^63 and 2^63-1.
     *
     * If the current field value is not of type 'number', or if the field does
     * not yet exist, the transformation will set the field to the given value.
     *
     * @param n The value to increment by.
     * @return The FieldValue sentinel for use in a call to set(), create() or
     * update().
     */
    static increment(n: number): FieldValue;

    /**
     * Returns a special value that can be used with set(), create() or update()
     * that tells the server to union the given elements with any array value
     * that already exists on the server. Each specified element that doesn't
     * already exist in the array will be added to the end. If the field being
     * modified is not already an array it will be overwritten with an array
     * containing exactly the specified elements.
     *
     * @param elements The elements to union into the array.
     * @return The FieldValue sentinel for use in a call to set(), create() or
     * update().
     */
    static arrayUnion(...elements: any[]): FieldValue;

    /**
     * Returns a special value that can be used with set(), create() or update()
     * that tells the server to remove the given elements from any array value
     * that already exists on the server. All instances of each element
     * specified will be removed from the array. If the field being modified is
     * not already an array it will be overwritten with an empty array.
     *
     * @param elements The elements to remove from the array.
     * @return The FieldValue sentinel for use in a call to set(), create() or
     * update().
     */
    static arrayRemove(...elements: any[]): FieldValue;

    /**
     * Returns true if this `FieldValue` is equal to the provided one.
     *
     * @param other The `FieldValue` to compare against.
     * @return true if this `FieldValue` is equal to the provided one.
     */
    isEqual(other: FieldValue): boolean;
  }

  /**
   * A FieldPath refers to a field in a document. The path may consist of a
   * single field name (referring to a top-level field in the document), or a
   * list of field names (referring to a nested field in the document).
   */
  export class FieldPath {
    /**
     * Creates a FieldPath from the provided field names. If more than one field
     * name is provided, the path will point to a nested field in a document.
     *
     * @param fieldNames A list of field names.
     */
    constructor(...fieldNames: string[]);

    /**
     * Returns a special sentinel FieldPath to refer to the ID of a document.
     * It can be used in queries to sort or filter by the document ID.
     */
    static documentId(): FieldPath;

    /**
     * Returns true if this `FieldPath` is equal to the provided one.
     *
     * @param other The `FieldPath` to compare against.
     * @return true if this `FieldPath` is equal to the provided one.
     */
    isEqual(other: FieldPath): boolean;
  }

  /**
   * A Timestamp represents a point in time independent of any time zone or
   * calendar, represented as seconds and fractions of seconds at nanosecond
   * resolution in UTC Epoch time. It is encoded using the Proleptic Gregorian
   * Calendar which extends the Gregorian calendar backwards to year one. It is
   * encoded assuming all minutes are 60 seconds long, i.e. leap seconds are
   * "smeared" so that no leap second table is needed for interpretation. Range
   * is from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59.999999999Z.
   *
   * @see https://github.com/google/protobuf/blob/master/src/google/protobuf/timestamp.proto
   */
  export class Timestamp {
    /**
     * Creates a new timestamp with the current date, with millisecond precision.
     *
     * @return A new `Timestamp` representing the current date.
     */
    static now(): Timestamp;

    /**
     * Creates a new timestamp from the given date.
     *
     * @param date The date to initialize the `Timestamp` from.
     * @return A new `Timestamp` representing the same point in time as the
     * given date.
     */
    static fromDate(date: Date): Timestamp;

    /**
     * Creates a new timestamp from the given number of milliseconds.
     *
     * @param milliseconds Number of milliseconds since Unix epoch
     * 1970-01-01T00:00:00Z.
     * @return A new `Timestamp` representing the same point in time as the
     * given number of milliseconds.
     */
    static fromMillis(milliseconds: number): Timestamp;

    /**
     * Creates a new timestamp.
     *
     * @param seconds The number of seconds of UTC time since Unix epoch
     * 1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
     * 9999-12-31T23:59:59Z inclusive.
     * @param nanoseconds The non-negative fractions of a second at nanosecond
     * resolution. Negative second values with fractions must still have
     * non-negative nanoseconds values that count forward in time. Must be from
     * 0 to 999,999,999 inclusive.
     */
    constructor(seconds: number, nanoseconds: number);

    /**
     * The number of seconds of UTC time since Unix epoch 1970-01-01T00:00:00Z.
     */
    readonly seconds: number;

    /** The non-negative fractions of a second at nanosecond resolution. */
    readonly nanoseconds: number;

    /**
     * Returns a new `Date` corresponding to this timestamp. This may lose
     * precision.
     *
     * @return JavaScript `Date` object representing the same point in time as
     * this `Timestamp`, with millisecond precision.
     */
    toDate(): Date;

    /**
     * Returns the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
     *
     * @return The point in time corresponding to this timestamp, represented as
     * the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
     */
    toMillis(): number;

    /**
     * Returns true if this `Timestamp` is equal to the provided one.
     *
     * @param other The `Timestamp` to compare against.
     * @return 'true' if this `Timestamp` is equal to the provided one.
     */
    isEqual(other: Timestamp): boolean;

    /**
     * Converts this object to a primitive `string`, which allows `Timestamp` objects to be compared
     * using the `>`, `<=`, `>=` and `>` operators.
     *
     * @return a string encoding of this object.
     */
    valueOf(): string;
  }

  /**
   * The v1beta1 Veneer client. This client provides access to to the underlying
   * Firestore v1beta1 RPCs.
   */
  export const v1beta1: any;

  /**
   * The v1 Veneer clients. These clients provide access to the Firestore Admin
   * API and the underlying Firestore v1 RPCs.
   */
  export const v1: { FirestoreClient: any; FirestoreAdminClient: any };

  /**
   * Status codes returned by Firestore's gRPC calls.
   */
  export enum GrpcStatus {
    OK = 0,
    CANCELLED = 1,
    UNKNOWN = 2,
    INVALID_ARGUMENT = 3,
    DEADLINE_EXCEEDED = 4,
    NOT_FOUND = 5,
    ALREADY_EXISTS = 6,
    PERMISSION_DENIED = 7,
    RESOURCE_EXHAUSTED = 8,
    FAILED_PRECONDITION = 9,
    ABORTED = 10,
    OUT_OF_RANGE = 11,
    UNIMPLEMENTED = 12,
    INTERNAL = 13,
    UNAVAILABLE = 14,
    DATA_LOSS = 15,
    UNAUTHENTICATED = 16,
  }
}

declare module "@google-cloud/firestore" {
  export = FirebaseFirestore;
}
