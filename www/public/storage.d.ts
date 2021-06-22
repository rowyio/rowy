/* eslint-disable @typescript-eslint/ban-types */

// firetable/ft_build/functions/node_modules/@google-cloud/storage/build/src/bucket.d.ts
declare class Bucket {
  /**
   * The bucket's name.
   * @name Bucket#name
   * @type {string}
   */
  name: string;
  /**
   * A reference to the {@link Storage} associated with this {@link Bucket}
   * instance.
   * @name Bucket#storage
   * @type {Storage}
   */
  storage: Storage;
  /**
   * A user project to apply to each request from this bucket.
   * @name Bucket#userProject
   * @type {string}
   */
  userProject?: string;
  /**
   * Cloud Storage uses access control lists (ACLs) to manage object and
   * bucket access. ACLs are the mechanism you use to share objects with other
   * users and allow other users to access your buckets and objects.
   *
   * An ACL consists of one or more entries, where each entry grants permissions
   * to an entity. Permissions define the actions that can be performed against
   * an object or bucket (for example, `READ` or `WRITE`); the entity defines
   * who the permission applies to (for example, a specific user or group of
   * users).
   *
   * The `acl` object on a Bucket instance provides methods to get you a list of
   * the ACLs defined on your bucket, as well as set, update, and delete them.
   *
   * Buckets also have
   * [default
   * ACLs](https://cloud.google.com/storage/docs/access-control/lists#default)
   * for all created files. Default ACLs specify permissions that all new
   * objects added to the bucket will inherit by default. You can add, delete,
   * get, and update entities and permissions for these as well with
   * {@link Bucket#acl.default}.
   *
   * @see [About Access Control Lists]{@link http://goo.gl/6qBBPO}
   * @see [Default ACLs]{@link https://cloud.google.com/storage/docs/access-control/lists#default}
   *
   * @name Bucket#acl
   * @mixes Acl
   * @property {Acl} default Cloud Storage Buckets have
   * [default
   * ACLs](https://cloud.google.com/storage/docs/access-control/lists#default)
   * for all created files. You can add, delete, get, and update entities and
   * permissions for these as well. The method signatures and examples are all
   * the same, after only prefixing the method call with `default`.
   *
   * @example
   * const {Storage} = require('@google-cloud/storage');
   * const storage = new Storage();
   *
   * //-
   * // Make a bucket's contents publicly readable.
   * //-
   * const myBucket = storage.bucket('my-bucket');
   *
   * const options = {
   *   entity: 'allUsers',
   *   role: storage.acl.READER_ROLE
   * };
   *
   * myBucket.acl.add(options, function(err, aclObject) {});
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * myBucket.acl.add(options).then(function(data) {
   *   const aclObject = data[0];
   *   const apiResponse = data[1];
   * });
   *
   * @example <caption>include:samples/acl.js</caption>
   * region_tag:storage_print_bucket_acl
   * Example of printing a bucket's ACL:
   *
   * @example <caption>include:samples/acl.js</caption>
   * region_tag:storage_print_bucket_acl_for_user
   * Example of printing a bucket's ACL for a specific user:
   *
   * @example <caption>include:samples/acl.js</caption>
   * region_tag:storage_add_bucket_owner
   * Example of adding an owner to a bucket:
   *
   * @example <caption>include:samples/acl.js</caption>
   * region_tag:storage_remove_bucket_owner
   * Example of removing an owner from a bucket:
   *
   * @example <caption>include:samples/acl.js</caption>
   * region_tag:storage_add_bucket_default_owner
   * Example of adding a default owner to a bucket:
   *
   * @example <caption>include:samples/acl.js</caption>
   * region_tag:storage_remove_bucket_default_owner
   * Example of removing a default owner from a bucket:
   */
  acl: Acl;
  /**
   * Get and set IAM policies for your bucket.
   *
   * @name Bucket#iam
   * @mixes Iam
   *
   * @see [Cloud Storage IAM Management](https://cloud.google.com/storage/docs/access-control/iam#short_title_iam_management)
   * @see [Granting, Changing, and Revoking Access](https://cloud.google.com/iam/docs/granting-changing-revoking-access)
   * @see [IAM Roles](https://cloud.google.com/iam/docs/understanding-roles)
   *
   * @example
   * const {Storage} = require('@google-cloud/storage');
   * const storage = new Storage();
   * const bucket = storage.bucket('albums');
   *
   * //-
   * // Get the IAM policy for your bucket.
   * //-
   * bucket.iam.getPolicy(function(err, policy) {
   *   console.log(policy);
   * });
   *
   * //-
   * // If the callback is omitted, we'll return a Promise.
   * //-
   * bucket.iam.getPolicy().then(function(data) {
   *   const policy = data[0];
   *   const apiResponse = data[1];
   * });
   *
   * @example <caption>include:samples/iam.js</caption>
   * region_tag:storage_view_bucket_iam_members
   * Example of retrieving a bucket's IAM policy:
   *
   * @example <caption>include:samples/iam.js</caption>
   * region_tag:storage_add_bucket_iam_member
   * Example of adding to a bucket's IAM policy:
   *
   * @example <caption>include:samples/iam.js</caption>
   * region_tag:storage_remove_bucket_iam_member
   * Example of removing from a bucket's IAM policy:
   */
  iam: Iam;
  /**
   * Get {@link File} objects for the files currently in the bucket as a
   * readable object stream.
   *
   * @method Bucket#getFilesStream
   * @param {GetFilesOptions} [query] Query object for listing files.
   * @returns {ReadableStream} A readable stream that emits {@link File} instances.
   *
   * @example
   * const {Storage} = require('@google-cloud/storage');
   * const storage = new Storage();
   * const bucket = storage.bucket('albums');
   *
   * bucket.getFilesStream()
   *   .on('error', console.error)
   *   .on('data', function(file) {
   *     // file is a File object.
   *   })
   *   .on('end', function() {
   *     // All files retrieved.
   *   });
   *
   * //-
   * // If you anticipate many results, you can end a stream early to prevent
   * // unnecessary processing and API requests.
   * //-
   * bucket.getFilesStream()
   *   .on('data', function(file) {
   *     this.end();
   *   });
   *
   * //-
   * // If you're filtering files with a delimiter, you should use
   * // {@link Bucket#getFiles} and set `autoPaginate: false` in order to
   * // preserve the `apiResponse` argument.
   * //-
   * const prefixes = [];
   *
   * function callback(err, files, nextQuery, apiResponse) {
   *   prefixes = prefixes.concat(apiResponse.prefixes);
   *
   *   if (nextQuery) {
   *     bucket.getFiles(nextQuery, callback);
   *   } else {
   *     // prefixes = The finished array of prefixes.
   *   }
   * }
   *
   * bucket.getFiles({
   *   autoPaginate: false,
   *   delimiter: '/'
   * }, callback);
   */
  getFilesStream: Function;
  signer?: URLSigner;
  constructor(storage: Storage, name: string, options?: BucketOptions);
  addLifecycleRule(
    rule: LifecycleRule,
    options?: AddLifecycleRuleOptions
  ): Promise<SetBucketMetadataResponse>;
  addLifecycleRule(
    rule: LifecycleRule,
    options: AddLifecycleRuleOptions,
    callback: SetBucketMetadataCallback
  ): void;
  addLifecycleRule(
    rule: LifecycleRule,
    callback: SetBucketMetadataCallback
  ): void;
  combine(
    sources: string[] | File[],
    destination: string | File,
    options?: CombineOptions
  ): Promise<CombineResponse>;
  combine(
    sources: string[] | File[],
    destination: string | File,
    options: CombineOptions,
    callback: CombineCallback
  ): void;
  combine(
    sources: string[] | File[],
    destination: string | File,
    callback: CombineCallback
  ): void;
  createChannel(
    id: string,
    config: CreateChannelConfig,
    options?: CreateChannelOptions
  ): Promise<CreateChannelResponse>;
  createChannel(
    id: string,
    config: CreateChannelConfig,
    callback: CreateChannelCallback
  ): void;
  createChannel(
    id: string,
    config: CreateChannelConfig,
    options: CreateChannelOptions,
    callback: CreateChannelCallback
  ): void;
  createNotification(
    topic: string,
    options?: CreateNotificationOptions
  ): Promise<CreateNotificationResponse>;
  createNotification(
    topic: string,
    options: CreateNotificationOptions,
    callback: CreateNotificationCallback
  ): void;
  createNotification(topic: string, callback: CreateNotificationCallback): void;
  deleteFiles(query?: DeleteFilesOptions): Promise<void>;
  deleteFiles(callback: DeleteFilesCallback): void;
  deleteFiles(query: DeleteFilesOptions, callback: DeleteFilesCallback): void;
  deleteLabels(labels?: string | string[]): Promise<DeleteLabelsResponse>;
  deleteLabels(callback: DeleteLabelsCallback): void;
  deleteLabels(labels: string | string[], callback: DeleteLabelsCallback): void;
  disableRequesterPays(): Promise<DisableRequesterPaysResponse>;
  disableRequesterPays(callback: DisableRequesterPaysCallback): void;
  enableLogging(
    config: EnableLoggingOptions
  ): Promise<SetBucketMetadataResponse>;
  enableLogging(
    config: EnableLoggingOptions,
    callback: SetBucketMetadataCallback
  ): void;
  enableRequesterPays(): Promise<EnableRequesterPaysResponse>;
  enableRequesterPays(callback: EnableRequesterPaysCallback): void;
  /**
   * Create a {@link File} object. See {@link File} to see how to handle
   * the different use cases you may have.
   *
   * @param {string} name The name of the file in this bucket.
   * @param {object} [options] Configuration options.
   * @param {string|number} [options.generation] Only use a specific revision of
   *     this file.
   * @param {string} [options.encryptionKey] A custom encryption key. See
   *     [Customer-supplied Encryption
   * Keys](https://cloud.google.com/storage/docs/encryption#customer-supplied).
   * @param {string} [options.kmsKeyName] The name of the Cloud KMS key that will
   *     be used to encrypt the object. Must be in the format:
   *     `projects/my-project/locations/location/keyRings/my-kr/cryptoKeys/my-key`.
   *     KMS key ring must use the same location as the bucket.
   * @returns {File}
   *
   * @example
   * const {Storage} = require('@google-cloud/storage');
   * const storage = new Storage();
   * const bucket = storage.bucket('albums');
   * const file = bucket.file('my-existing-file.png');
   */
  file(name: string, options?: FileOptions): File;
  getFiles(query?: GetFilesOptions): Promise<GetFilesResponse>;
  getFiles(query: GetFilesOptions, callback: GetFilesCallback): void;
  getFiles(callback: GetFilesCallback): void;
  getLabels(options: GetLabelsOptions): Promise<GetLabelsResponse>;
  getLabels(callback: GetLabelsCallback): void;
  getLabels(options: GetLabelsOptions, callback: GetLabelsCallback): void;
  getNotifications(
    options?: GetNotificationsOptions
  ): Promise<GetNotificationsResponse>;
  getNotifications(callback: GetNotificationsCallback): void;
  getNotifications(
    options: GetNotificationsOptions,
    callback: GetNotificationsCallback
  ): void;
  getSignedUrl(cfg: GetBucketSignedUrlConfig): Promise<GetSignedUrlResponse>;
  getSignedUrl(
    cfg: GetBucketSignedUrlConfig,
    callback: GetSignedUrlCallback
  ): void;
  lock(metageneration: number | string): Promise<BucketLockResponse>;
  lock(metageneration: number | string, callback: BucketLockCallback): void;
  makePrivate(
    options?: MakeBucketPrivateOptions
  ): Promise<MakeBucketPrivateResponse>;
  makePrivate(callback: MakeBucketPrivateCallback): void;
  makePrivate(
    options: MakeBucketPrivateOptions,
    callback: MakeBucketPrivateCallback
  ): void;
  makePublic(
    options?: MakeBucketPublicOptions
  ): Promise<MakeBucketPublicResponse>;
  makePublic(callback: MakeBucketPublicCallback): void;
  makePublic(
    options: MakeBucketPublicOptions,
    callback: MakeBucketPublicCallback
  ): void;
  /**
   * Get a reference to a Cloud Pub/Sub Notification.
   *
   * @param {string} id ID of notification.
   * @returns {Notification}
   * @see Notification
   *
   * @example
   * const {Storage} = require('@google-cloud/storage');
   * const storage = new Storage();
   * const bucket = storage.bucket('my-bucket');
   * const notification = bucket.notification('1');
   */
  notification(id: string): Notification;
  removeRetentionPeriod(): Promise<SetBucketMetadataResponse>;
  removeRetentionPeriod(callback: SetBucketMetadataCallback): void;
  request(reqOpts: DecorateRequestOptions): Promise<[ResponseBody, Metadata]>;
  request(
    reqOpts: DecorateRequestOptions,
    callback: BodyResponseCallback
  ): void;
  setLabels(
    labels: Labels,
    options?: SetLabelsOptions
  ): Promise<SetLabelsResponse>;
  setLabels(labels: Labels, callback: SetLabelsCallback): void;
  setLabels(
    labels: Labels,
    options: SetLabelsOptions,
    callback: SetLabelsCallback
  ): void;
  setRetentionPeriod(duration: number): Promise<SetBucketMetadataResponse>;
  setRetentionPeriod(
    duration: number,
    callback: SetBucketMetadataCallback
  ): void;
  setCorsConfiguration(
    corsConfiguration: Cors[]
  ): Promise<SetBucketMetadataResponse>;
  setCorsConfiguration(
    corsConfiguration: Cors[],
    callback: SetBucketMetadataCallback
  ): void;
  setStorageClass(
    storageClass: string,
    options?: SetBucketStorageClassOptions
  ): Promise<SetBucketMetadataResponse>;
  setStorageClass(
    storageClass: string,
    callback: SetBucketStorageClassCallback
  ): void;
  setStorageClass(
    storageClass: string,
    options: SetBucketStorageClassOptions,
    callback: SetBucketStorageClassCallback
  ): void;
  /**
   * Set a user project to be billed for all requests made from this Bucket
   * object and any files referenced from this Bucket object.
   *
   * @param {string} userProject The user project.
   *
   * @example
   * const {Storage} = require('@google-cloud/storage');
   * const storage = new Storage();
   * const bucket = storage.bucket('albums');
   *
   * bucket.setUserProject('grape-spaceship-123');
   */
  setUserProject(userProject: string): void;
  upload(pathString: string, options?: UploadOptions): Promise<UploadResponse>;
  upload(
    pathString: string,
    options: UploadOptions,
    callback: UploadCallback
  ): void;
  upload(pathString: string, callback: UploadCallback): void;
  makeAllFilesPublicPrivate_(
    options?: MakeAllFilesPublicPrivateOptions
  ): Promise<MakeAllFilesPublicPrivateResponse>;
  makeAllFilesPublicPrivate_(callback: MakeAllFilesPublicPrivateCallback): void;
  makeAllFilesPublicPrivate_(
    options: MakeAllFilesPublicPrivateOptions,
    callback: MakeAllFilesPublicPrivateCallback
  ): void;
  getId(): string;
}

/*! firebase-admin v9.4.2 */
declare namespace firebasestorage {
  /**
   * The default `Storage` service if no
   * app is provided or the `Storage` service associated with the provided
   * app.
   */
  export class Storage {
    /**
     * Optional app whose `Storage` service to
     * return. If not provided, the default `Storage` service will be returned.
     */
    app: app.App;
    /**
     * @returns A [Bucket](https://cloud.google.com/nodejs/docs/reference/storage/latest/Bucket)
     * instance as defined in the `@google-cloud/storage` package.
     */
    bucket(name?: string): Bucket;
  }
}
