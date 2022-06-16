/* eslint-disable tsdoc/syntax */
/*! firebase-admin v8.11.0 */

/* eslint-disable @typescript-eslint/ban-types */

declare namespace firebaseauth {
  /**
   * Interface representing a user's metadata.
   */
  interface UserMetadata {
    /**
     * The date the user last signed in, formatted as a UTC string.
     */
    lastSignInTime: string;

    /**
     * The date the user was created, formatted as a UTC string.
     *
     */
    creationTime: string;

    /**
     * @return A JSON-serializable representation of this object.
     */
    toJSON(): Object;
  }

  /**
   * Interface representing a user's info from a third-party identity provider
   * such as Google or Facebook.
   */
  interface UserInfo {
    /**
     * The user identifier for the linked provider.
     */
    uid: string;

    /**
     * The display name for the linked provider.
     */
    displayName: string;

    /**
     * The email for the linked provider.
     */
    email: string;

    /**
     * The phone number for the linked provider.
     */
    phoneNumber: string;

    /**
     * The photo URL for the linked provider.
     */
    photoURL: string;

    /**
     * The linked provider ID (for example, "google.com" for the Google provider).
     */
    providerId: string;

    /**
     * @return A JSON-serializable representation of this object.
     */
    toJSON(): Object;
  }

  /**
   * Interface representing the common properties of a user enrolled second factor.
   */
  interface MultiFactorInfo {
    /**
     * The ID of the enrolled second factor. This ID is unique to the user.
     */
    uid: string;

    /**
     * The optional display name of the enrolled second factor.
     */
    displayName?: string;

    /**
     * The optional date the second factor was enrolled, formatted as a UTC string.
     */
    enrollmentTime?: string;

    /**
     * The type identifier of the second factor. For SMS second factors, this is `phone`.
     */
    factorId: string;

    /**
     * @return A JSON-serializable representation of this object.
     */
    toJSON(): Object;
  }

  /**
   * Interface representing a phone specific user enrolled second factor.
   */
  interface PhoneMultiFactorInfo extends MultiFactorInfo {
    /**
     * The phone number associated with a phone second factor.
     */
    phoneNumber: string;
  }

  /**
   * Interface representing a user.
   */
  interface UserRecord {
    /**
     * The user's `uid`.
     */
    uid: string;

    /**
     * The user's primary email, if set.
     */
    email?: string;

    /**
     * Whether or not the user's primary email is verified.
     */
    emailVerified: boolean;

    /**
     * The user's display name.
     */
    displayName?: string;

    /**
     * The user's primary phone number, if set.
     */
    phoneNumber?: string;

    /**
     * The user's photo URL.
     */
    photoURL?: string;

    /**
     * Whether or not the user is disabled: `true` for disabled; `false` for
     * enabled.
     */
    disabled: boolean;

    /**
     * Additional metadata about the user.
     */
    metadata: admin.auth.UserMetadata;

    /**
     * An array of providers (for example, Google, Facebook) linked to the user.
     */
    providerData: admin.auth.UserInfo[];

    /**
     * The user's hashed password (base64-encoded), only if Firebase Auth hashing
     * algorithm (SCRYPT) is used. If a different hashing algorithm had been used
     * when uploading this user, as is typical when migrating from another Auth
     * system, this will be an empty string. If no password is set, this is
     * null. This is only available when the user is obtained from
     * {@link https://firebase.google.com/docs/reference/admin/node/admin.auth.Auth#listUsers `listUsers()`}.
     *
     */
    passwordHash?: string;

    /**
     * The user's password salt (base64-encoded), only if Firebase Auth hashing
     * algorithm (SCRYPT) is used. If a different hashing algorithm had been used to
     * upload this user, typical when migrating from another Auth system, this will
     * be an empty string. If no password is set, this is null. This is only
     * available when the user is obtained from
     * {@link https://firebase.google.com/docs/reference/admin/node/admin.auth.Auth#listUsers `listUsers()`}.
     *
     */
    passwordSalt?: string;

    /**
     * The user's custom claims object if available, typically used to define
     * user roles and propagated to an authenticated user's ID token.
     * This is set via
     * {@link https://firebase.google.com/docs/reference/admin/node/admin.auth.Auth#setCustomUserClaims `setCustomUserClaims()`}
     */
    customClaims?: Object;

    /**
     * The date the user's tokens are valid after, formatted as a UTC string.
     * This is updated every time the user's refresh token are revoked either
     * from the {@link https://firebase.google.com/docs/reference/admin/node/admin.auth.Auth#revokeRefreshTokens `revokeRefreshTokens()`}
     * API or from the Firebase Auth backend on big account changes (password
     * resets, password or email updates, etc).
     */
    tokensValidAfterTime?: string;

    /**
     * The ID of the tenant the user belongs to, if available.
     */
    tenantId?: string | null;

    /**
     * The multi-factor related properties for the current user, if available.
     */
    multiFactor?: admin.auth.MultiFactorSettings;

    /**
     * @return A JSON-serializable representation of this object.
     */
    toJSON(): Object;
  }

  /**
   * The multi-factor related user settings.
   */
  interface MultiFactorSettings {
    /**
     * List of second factors enrolled with the current user.
     * Currently only phone second factors are supported.
     */
    enrolledFactors: admin.auth.MultiFactorInfo[];

    /**
     * @return A JSON-serializable representation of this multi-factor object.
     */
    toJSON(): Object;
  }

  /**
   * The multi-factor related user settings for create operations.
   */
  interface MultiFactorCreateSettings {
    /**
     * The created user's list of enrolled second factors.
     */
    enrolledFactors: admin.auth.CreateMultiFactorInfoRequest[];
  }

  /**
   * The multi-factor related user settings for update operations.
   */
  interface MultiFactorUpdateSettings {
    /**
     * The updated list of enrolled second factors. The provided list overwrites the user's
     * existing list of second factors.
     * When null is passed, all of the user's existing second factors are removed.
     */
    enrolledFactors: admin.auth.UpdateMultiFactorInfoRequest[] | null;
  }

  /**
   * Interface representing common properties of a user enrolled second factor
   * for an `UpdateRequest`.
   */
  interface UpdateMultiFactorInfoRequest {
    /**
     * The ID of the enrolled second factor. This ID is unique to the user. When not provided,
     * a new one is provisioned by the Auth server.
     */
    uid?: string;

    /**
     * The optional display name for an enrolled second factor.
     */
    displayName?: string;

    /**
     * The optional date the second factor was enrolled, formatted as a UTC string.
     */
    enrollmentTime?: string;

    /**
     * The type identifier of the second factor. For SMS second factors, this is `phone`.
     */
    factorId: string;
  }

  /**
   * Interface representing a phone specific user enrolled second factor
   * for an `UpdateRequest`.
   */
  interface UpdatePhoneMultiFactorInfoRequest
    extends UpdateMultiFactorInfoRequest {
    /**
     * The phone number associated with a phone second factor.
     */
    phoneNumber: string;
  }

  /**
   * Interface representing the properties to update on the provided user.
   */
  interface UpdateRequest {
    /**
     * Whether or not the user is disabled: `true` for disabled;
     * `false` for enabled.
     */
    disabled?: boolean;

    /**
     * The user's display name.
     */
    displayName?: string | null;

    /**
     * The user's primary email.
     */
    email?: string;

    /**
     * Whether or not the user's primary email is verified.
     */
    emailVerified?: boolean;

    /**
     * The user's unhashed password.
     */
    password?: string;

    /**
     * The user's primary phone number.
     */
    phoneNumber?: string | null;

    /**
     * The user's photo URL.
     */
    photoURL?: string | null;

    /**
     * The user's updated multi-factor related properties.
     */
    multiFactor?: admin.auth.MultiFactorUpdateSettings;
  }

  /**
   * Interface representing base properties of a user enrolled second factor for a
   * `CreateRequest`.
   */
  interface CreateMultiFactorInfoRequest {
    /**
     * The optional display name for an enrolled second factor.
     */
    displayName?: string;

    /**
     * The type identifier of the second factor. For SMS second factors, this is `phone`.
     */
    factorId: string;
  }

  /**
   * Interface representing a phone specific user enrolled second factor for a
   * `CreateRequest`.
   */
  interface CreatePhoneMultiFactorInfoRequest
    extends CreateMultiFactorInfoRequest {
    /**
     * The phone number associated with a phone second factor.
     */
    phoneNumber: string;
  }

  /**
   * Interface representing the properties to set on a new user record to be
   * created.
   */
  interface CreateRequest extends UpdateRequest {
    /**
     * The user's `uid`.
     */
    uid?: string;

    /**
     * The user's multi-factor related properties.
     */
    multiFactor?: admin.auth.MultiFactorCreateSettings;
  }

  /**
   * Interface representing a decoded Firebase ID token, returned from the
   * {@link https://firebase.google.com/docs/reference/admin/node/admin.auth.Auth#verifyIdToken `verifyIdToken()`} method.
   *
   * Firebase ID tokens are OpenID Connect spec-compliant JSON Web Tokens (JWTs).
   * See the
   * [ID Token section of the OpenID Connect spec](http://openid.net/specs/openid-connect-core-1_0.html#IDToken)
   * for more information about the specific properties below.
   */
  interface DecodedIdToken {
    /**
     * The audience for which this token is intended.
     *
     * This value is a string equal to your Firebase project ID, the unique
     * identifier for your Firebase project, which can be found in [your project's
     * settings](https://console.firebase.google.com/project/_/settings/general/android:com.random.android).
     */
    aud: string;

    /**
     * Time, in seconds since the Unix epoch, when the end-user authentication
     * occurred.
     *
     * This value is not set when this particular ID token was created, but when the
     * user initially logged in to this session. In a single session, the Firebase
     * SDKs will refresh a user's ID tokens every hour. Each ID token will have a
     * different [`iat`](#iat) value, but the same `auth_time` value.
     */
    auth_time: number;

    /**
     * The email of the user to whom the ID token belongs, if available.
     */
    email?: string;

    /**
     * Whether or not the email of the user to whom the ID token belongs is
     * verified, provided the user has an email.
     */
    email_verified?: boolean;

    /**
     * The ID token's expiration time, in seconds since the Unix epoch. That is, the
     * time at which this ID token expires and should no longer be considered valid.
     *
     * The Firebase SDKs transparently refresh ID tokens every hour, issuing a new
     * ID token with up to a one hour expiration.
     */
    exp: number;

    /**
     * Information about the sign in event, including which sign in provider was
     * used and provider-specific identity details.
     *
     * This data is provided by the Firebase Authentication service and is a
     * reserved claim in the ID token.
     */
    firebase: {
      /**
       * Provider-specific identity details corresponding
       * to the provider used to sign in the user.
       */
      identities: {
        [key: string]: any;
      };

      /**
       * The ID of the provider used to sign in the user.
       * One of `"anonymous"`, `"password"`, `"facebook.com"`, `"github.com"`,
       * `"google.com"`, `"twitter.com"`, or `"custom"`.
       */
      sign_in_provider: string;

      /**
       * The type identifier or `factorId` of the second factor, provided the
       * ID token was obtained from a multi-factor authenticated user.
       * For phone, this is `"phone"`.
       */
      sign_in_second_factor?: string;

      /**
       * The `uid` of the second factor used to sign in, provided the
       * ID token was obtained from a multi-factor authenticated user.
       */
      second_factor_identifier?: string;

      /**
       * The ID of the tenant the user belongs to, if available.
       */
      tenant?: string;
      [key: string]: any;
    };

    /**
     * The ID token's issued-at time, in seconds since the Unix epoch. That is, the
     * time at which this ID token was issued and should start to be considered
     * valid.
     *
     * The Firebase SDKs transparently refresh ID tokens every hour, issuing a new
     * ID token with a new issued-at time. If you want to get the time at which the
     * user session corresponding to the ID token initially occurred, see the
     * [`auth_time`](#auth_time) property.
     */
    iat: number;

    /**
     * The issuer identifier for the issuer of the response.
     *
     * This value is a URL with the format
     * `https://securetoken.google.com/<PROJECT_ID>`, where `<PROJECT_ID>` is the
     * same project ID specified in the [`aud`](#aud) property.
     */
    iss: string;

    /**
     * The phone number of the user to whom the ID token belongs, if available.
     */
    phone_number?: string;

    /**
     * The photo URL for the user to whom the ID token belongs, if available.
     */
    picture?: string;

    /**
     * The `uid` corresponding to the user who the ID token belonged to.
     *
     * As a convenience, this value is copied over to the [`uid`](#uid) property.
     */
    sub: string;

    /**
     * The `uid` corresponding to the user who the ID token belonged to.
     *
     * This value is not actually in the JWT token claims itself. It is added as a
     * convenience, and is set as the value of the [`sub`](#sub) property.
     */
    uid: string;
    [key: string]: any;
  }

  /**
   * Interface representing the object returned from a
   * {@link https://firebase.google.com/docs/reference/admin/node/admin.auth.Auth#listUsers `listUsers()`} operation. Contains the list
   * of users for the current batch and the next page token if available.
   */
  interface ListUsersResult {
    /**
     * The list of {@link admin.auth.UserRecord `UserRecord`} objects for the
     * current downloaded batch.
     */
    users: admin.auth.UserRecord[];

    /**
     * The next page token if available. This is needed for the next batch download.
     */
    pageToken?: string;
  }

  type HashAlgorithmType =
    | "SCRYPT"
    | "STANDARD_SCRYPT"
    | "HMAC_SHA512"
    | "HMAC_SHA256"
    | "HMAC_SHA1"
    | "HMAC_MD5"
    | "MD5"
    | "PBKDF_SHA1"
    | "BCRYPT"
    | "PBKDF2_SHA256"
    | "SHA512"
    | "SHA256"
    | "SHA1";

  /**
   * Interface representing the user import options needed for
   * {@link https://firebase.google.com/docs/reference/admin/node/admin.auth.Auth#importUsers `importUsers()`} method. This is used to
   * provide the password hashing algorithm information.
   */
  interface UserImportOptions {
    /**
     * The password hashing information.
     */
    hash: {
      /**
       * The password hashing algorithm identifier. The following algorithm
       * identifiers are supported:
       * `SCRYPT`, `STANDARD_SCRYPT`, `HMAC_SHA512`, `HMAC_SHA256`, `HMAC_SHA1`,
       * `HMAC_MD5`, `MD5`, `PBKDF_SHA1`, `BCRYPT`, `PBKDF2_SHA256`, `SHA512`,
       * `SHA256` and `SHA1`.
       */
      algorithm: HashAlgorithmType;

      /**
       * The signing key used in the hash algorithm in buffer bytes.
       * Required by hashing algorithms `SCRYPT`, `HMAC_SHA512`, `HMAC_SHA256`,
       * `HAMC_SHA1` and `HMAC_MD5`.
       */
      key?: Buffer;

      /**
       * The salt separator in buffer bytes which is appended to salt when
       * verifying a password. This is only used by the `SCRYPT` algorithm.
       */
      saltSeparator?: Buffer;

      /**
       * The number of rounds for hashing calculation.
       * Required for `SCRYPT`, `MD5`, `SHA512`, `SHA256`, `SHA1`, `PBKDF_SHA1` and
       * `PBKDF2_SHA256`.
       */
      rounds?: number;

      /**
       * The memory cost required for `SCRYPT` algorithm, or the CPU/memory cost.
       * Required for `STANDARD_SCRYPT` algorithm.
       */
      memoryCost?: number;

      /**
       * The parallelization of the hashing algorithm. Required for the
       * `STANDARD_SCRYPT` algorithm.
       */
      parallelization?: number;

      /**
       * The block size (normally 8) of the hashing algorithm. Required for the
       * `STANDARD_SCRYPT` algorithm.
       */
      blockSize?: number;
      /**
       * The derived key length of the hashing algorithm. Required for the
       * `STANDARD_SCRYPT` algorithm.
       */
      derivedKeyLength?: number;
    };
  }

  /**
   * Interface representing the response from the
   * {@link https://firebase.google.com/docs/reference/admin/node/admin.auth.Auth#importUsers `importUsers()`} method for batch
   * importing users to Firebase Auth.
   */
  interface UserImportResult {
    /**
     * The number of user records that failed to import to Firebase Auth.
     */
    failureCount: number;

    /**
     * The number of user records that successfully imported to Firebase Auth.
     */
    successCount: number;

    /**
     * An array of errors corresponding to the provided users to import. The
     * length of this array is equal to [`failureCount`](#failureCount).
     */
  }

  /**
   * User metadata to include when importing a user.
   */
  interface UserMetadataRequest {
    /**
     * The date the user last signed in, formatted as a UTC string.
     */
    lastSignInTime?: string;

    /**
     * The date the user was created, formatted as a UTC string.
     */
    creationTime?: string;
  }

  /**
   * User provider data to include when importing a user.
   */
  interface UserProviderRequest {
    /**
     * The user identifier for the linked provider.
     */
    uid: string;

    /**
     * The display name for the linked provider.
     */
    displayName?: string;

    /**
     * The email for the linked provider.
     */
    email?: string;

    /**
     * The phone number for the linked provider.
     */
    phoneNumber?: string;

    /**
     * The photo URL for the linked provider.
     */
    photoURL?: string;

    /**
     * The linked provider ID (for example, "google.com" for the Google provider).
     */
    providerId: string;
  }

  /**
   * Interface representing a user to import to Firebase Auth via the
   * {@link https://firebase.google.com/docs/reference/admin/node/admin.auth.Auth#importUsers `importUsers()`} method.
   */
  interface UserImportRecord {
    /**
     * The user's `uid`.
     */
    uid: string;

    /**
     * The user's primary email, if set.
     */
    email?: string;

    /**
     * Whether or not the user's primary email is verified.
     */
    emailVerified?: boolean;

    /**
     * The user's display name.
     */
    displayName?: string;

    /**
     * The user's primary phone number, if set.
     */
    phoneNumber?: string;

    /**
     * The user's photo URL.
     */
    photoURL?: string;

    /**
     * Whether or not the user is disabled: `true` for disabled; `false` for
     * enabled.
     */
    disabled?: boolean;

    /**
     * Additional metadata about the user.
     */
    metadata?: admin.auth.UserMetadataRequest;

    /**
     * An array of providers (for example, Google, Facebook) linked to the user.
     */
    providerData?: admin.auth.UserProviderRequest[];

    /**
     * The user's custom claims object if available, typically used to define
     * user roles and propagated to an authenticated user's ID token.
     */
    customClaims?: Object;

    /**
     * The buffer of bytes representing the user's hashed password.
     * When a user is to be imported with a password hash,
     * {@link admin.auth.UserImportOptions `UserImportOptions`} are required to be
     * specified to identify the hashing algorithm used to generate this hash.
     */
    passwordHash?: Buffer;

    /**
     * The buffer of bytes representing the user's password salt.
     */
    passwordSalt?: Buffer;

    /**
     * The identifier of the tenant where user is to be imported to.
     * When not provided in an `admin.auth.Auth` context, the user is uploaded to
     * the default parent project.
     * When not provided in an `admin.auth.TenantAwareAuth` context, the user is uploaded
     * to the tenant corresponding to that `TenantAwareAuth` instance's tenant ID.
     */
    tenantId?: string | null;

    /**
     * The user's multi-factor related properties.
     */
    multiFactor?: admin.auth.MultiFactorUpdateSettings;
  }

  /**
   * Interface representing the session cookie options needed for the
   * {@link https://firebase.google.com/docs/reference/admin/node/admin.auth.Auth#createSessionCookie `createSessionCookie()`} method.
   */
  interface SessionCookieOptions {
    /**
     * The session cookie custom expiration in milliseconds. The minimum allowed is
     * 5 minutes and the maxium allowed is 2 weeks.
     */
    expiresIn: number;
  }

  /**
   * This is the interface that defines the required continue/state URL with
   * optional Android and iOS bundle identifiers.
   */
  interface ActionCodeSettings {
    /**
     * Defines the link continue/state URL, which has different meanings in
     * different contexts:
     * <ul>
     * <li>When the link is handled in the web action widgets, this is the deep
     *     link in the `continueUrl` query parameter.</li>
     * <li>When the link is handled in the app directly, this is the `continueUrl`
     *     query parameter in the deep link of the Dynamic Link.</li>
     * </ul>
     */
    url: string;

    /**
     * Whether to open the link via a mobile app or a browser.
     * The default is false. When set to true, the action code link is sent
     * as a Universal Link or Android App Link and is opened by the app if
     * installed. In the false case, the code is sent to the web widget first
     * and then redirects to the app if installed.
     */
    handleCodeInApp?: boolean;

    /**
     * Defines the iOS bundle ID. This will try to open the link in an iOS app if it
     * is installed.
     */
    iOS?: {
      /**
       * Defines the required iOS bundle ID of the app where the link should be
       * handled if the application is already installed on the device.
       */
      bundleId: string;
    };

    /**
     * Defines the Android package name. This will try to open the link in an
     * android app if it is installed. If `installApp` is passed, it specifies
     * whether to install the Android app if the device supports it and the app is
     * not already installed. If this field is provided without a `packageName`, an
     * error is thrown explaining that the `packageName` must be provided in
     * conjunction with this field. If `minimumVersion` is specified, and an older
     * version of the app is installed, the user is taken to the Play Store to
     * upgrade the app.
     */
    android?: {
      /**
       * Defines the required Android package name of the app where the link should be
       * handled if the Android app is installed.
       */
      packageName: string;

      /**
       * Whether to install the Android app if the device supports it and the app is
       * not already installed.
       */
      installApp?: boolean;

      /**
       * The Android minimum version if available. If the installed app is an older
       * version, the user is taken to the GOogle Play Store to upgrade the app.
       */
      minimumVersion?: string;
    };

    /**
     * Defines the dynamic link domain to use for the current link if it is to be
     * opened using Firebase Dynamic Links, as multiple dynamic link domains can be
     * configured per project. This field provides the ability to explicitly choose
     * configured per project. This fields provides the ability explicitly choose
     * one. If none is provided, the oldest domain is used by default.
     */
    dynamicLinkDomain?: string;
  }

  /**
   * Interface representing a tenant configuration.
   *
   * Multi-tenancy support requires Google Cloud's Identity Platform
   * (GCIP). To learn more about GCIP, including pricing and features,
   * see the [GCIP documentation](https://cloud.google.com/identity-platform)
   *
   * Before multi-tenancy can be used on a Google Cloud Identity Platform project,
   * tenants must be allowed on that project via the Cloud Console UI.
   *
   * A tenant configuration provides information such as the display name, tenant
   * identifier and email authentication configuration.
   * For OIDC/SAML provider configuration management, `TenantAwareAuth` instances should
   * be used instead of a `Tenant` to retrieve the list of configured IdPs on a tenant.
   * When configuring these providers, note that tenants will inherit
   * whitelisted domains and authenticated redirect URIs of their parent project.
   *
   * All other settings of a tenant will also be inherited. These will need to be managed
   * from the Cloud Console UI.
   */
  interface Tenant {
    /**
     * The tenant identifier.
     */
    tenantId: string;

    /**
     * The tenant display name.
     */
    displayName?: string;

    /**
     * The email sign in provider configuration.
     */
    emailSignInConfig?: {
      /**
       * Whether email provider is enabled.
       */
      enabled: boolean;

      /**
       * Whether password is required for email sign-in. When not required,
       * email sign-in can be performed with password or via email link sign-in.
       */
      passwordRequired?: boolean;
    };

    /**
     * @return A JSON-serializable representation of this object.
     */
    toJSON(): Object;
  }

  /**
   * Interface representing the properties to update on the provided tenant.
   */
  interface UpdateTenantRequest {
    /**
     * The tenant display name.
     */
    displayName?: string;

    /**
     * The email sign in configuration.
     */
    emailSignInConfig?: {
      /**
       * Whether email provider is enabled.
       */
      enabled: boolean;

      /**
       * Whether password is required for email sign-in. When not required,
       * email sign-in can be performed with password or via email link sign-in.
       */
      passwordRequired?: boolean;
    };
  }

  /**
   * Interface representing the properties to set on a new tenant.
   */
  type CreateTenantRequest = UpdateTenantRequest;

  /**
   * Interface representing the object returned from a
   * {@link https://firebase.google.com/docs/reference/admin/node/admin.auth.Auth#listTenants `listTenants()`}
   * operation.
   * Contains the list of tenants for the current batch and the next page token if available.
   */
  interface ListTenantsResult {
    /**
     * The list of {@link admin.auth.Tenant `Tenant`} objects for the downloaded batch.
     */
    tenants: admin.auth.Tenant[];

    /**
     * The next page token if available. This is needed for the next batch download.
     */
    pageToken?: string;
  }

  /**
   * The filter interface used for listing provider configurations. This is used
   * when specifying how to list configured identity providers via
   * {@link https://firebase.google.com/docs/reference/admin/node/admin.auth.Auth#listProviderConfigs `listProviderConfigs()`}.
   */
  interface AuthProviderConfigFilter {
    /**
     * The Auth provider configuration filter. This can be either `saml` or `oidc`.
     * The former is used to look up SAML providers only, while the latter is used
     * for OIDC providers.
     */
    type: "saml" | "oidc";

    /**
     * The maximum number of results to return per page. The default and maximum is
     * 100.
     */
    maxResults?: number;

    /**
     * The next page token. When not specified, the lookup starts from the beginning
     * of the list.
     */
    pageToken?: string;
  }

  /**
   * The base Auth provider configuration interface.
   */
  interface AuthProviderConfig {
    /**
     * The provider ID defined by the developer.
     * For a SAML provider, this is always prefixed by `saml.`.
     * For an OIDC provider, this is always prefixed by `oidc.`.
     */
    providerId: string;

    /**
     * The user-friendly display name to the current configuration. This name is
     * also used as the provider label in the Cloud Console.
     */
    displayName: string;

    /**
     * Whether the provider configuration is enabled or disabled. A user
     * cannot sign in using a disabled provider.
     */
    enabled: boolean;
  }

  /**
   * The
   * [SAML](http://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html)
   * Auth provider configuration interface. A SAML provider can be created via
   * {@link https://firebase.google.com/docs/reference/admin/node/admin.auth.Auth#createProviderConfig `createProviderConfig()`}.
   */
  interface SAMLAuthProviderConfig extends admin.auth.AuthProviderConfig {
    /**
     * The SAML IdP entity identifier.
     */
    idpEntityId: string;

    /**
     * The SAML IdP SSO URL. This must be a valid URL.
     */
    ssoURL: string;

    /**
     * The list of SAML IdP X.509 certificates issued by CA for this provider.
     * Multiple certificates are accepted to prevent outages during
     * IdP key rotation (for example ADFS rotates every 10 days). When the Auth
     * server receives a SAML response, it will match the SAML response with the
     * certificate on record. Otherwise the response is rejected.
     * Developers are expected to manage the certificate updates as keys are
     * rotated.
     */
    x509Certificates: string[];

    /**
     * The SAML relying party (service provider) entity ID.
     * This is defined by the developer but needs to be provided to the SAML IdP.
     */
    rpEntityId: string;

    /**
     * This is fixed and must always be the same as the OAuth redirect URL
     * provisioned by Firebase Auth,
     * `https://project-id.firebaseapp.com/__/auth/handler` unless a custom
     * `authDomain` is used.
     * The callback URL should also be provided to the SAML IdP during
     * configuration.
     */
    callbackURL?: string;
  }

  /**
   * The [OIDC](https://openid.net/specs/openid-connect-core-1_0-final.html) Auth
   * provider configuration interface. An OIDC provider can be created via
   * {@link https://firebase.google.com/docs/reference/admin/node/admin.auth.Auth#createProviderConfig `createProviderConfig()`}.
   */
  interface OIDCAuthProviderConfig extends admin.auth.AuthProviderConfig {
    /**
     * This is the required client ID used to confirm the audience of an OIDC
     * provider's
     * [ID token](https://openid.net/specs/openid-connect-core-1_0-final.html#IDToken).
     */
    clientId: string;

    /**
     * This is the required provider issuer used to match the provider issuer of
     * the ID token and to determine the corresponding OIDC discovery document, eg.
     * [`/.well-known/openid-configuration`](https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig).
     * This is needed for the following:
     * <ul>
     * <li>To verify the provided issuer.</li>
     * <li>Determine the authentication/authorization endpoint during the OAuth
     *     `id_token` authentication flow.</li>
     * <li>To retrieve the public signing keys via `jwks_uri` to verify the OIDC
     *     provider's ID token's signature.</li>
     * <li>To determine the claims_supported to construct the user attributes to be
     *     returned in the additional user info response.</li>
     * </ul>
     * ID token validation will be performed as defined in the
     * [spec](https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation).
     */
    issuer: string;
  }

  /**
   * The request interface for updating a SAML Auth provider. This is used
   * when updating a SAML provider's configuration via
   * {@link https://firebase.google.com/docs/reference/admin/node/admin.auth.Auth#updateProviderConfig `updateProviderConfig()`}.
   */
  interface SAMLUpdateAuthProviderRequest {
    /**
     * The SAML provider's updated display name. If not provided, the existing
     * configuration's value is not modified.
     */
    displayName?: string;

    /**
     * Whether the SAML provider is enabled or not. If not provided, the existing
     * configuration's setting is not modified.
     */
    enabled?: boolean;

    /**
     * The SAML provider's updated IdP entity ID. If not provided, the existing
     * configuration's value is not modified.
     */
    idpEntityId?: string;

    /**
     * The SAML provider's updated SSO URL. If not provided, the existing
     * configuration's value is not modified.
     */
    ssoURL?: string;

    /**
     * The SAML provider's updated list of X.509 certificated. If not provided, the
     * existing configuration list is not modified.
     */
    x509Certificates?: string[];

    /**
     * The SAML provider's updated RP entity ID. If not provided, the existing
     * configuration's value is not modified.
     */
    rpEntityId?: string;

    /**
     * The SAML provider's callback URL. If not provided, the existing
     * configuration's value is not modified.
     */
    callbackURL?: string;
  }

  /**
   * The request interface for updating an OIDC Auth provider. This is used
   * when updating an OIDC provider's configuration via
   * {@link https://firebase.google.com/docs/reference/admin/node/admin.auth.Auth#updateProviderConfig `updateProviderConfig()`}.
   */
  interface OIDCUpdateAuthProviderRequest {
    /**
     * The OIDC provider's updated display name. If not provided, the existing
     * configuration's value is not modified.
     */
    displayName?: string;

    /**
     * Whether the OIDC provider is enabled or not. If not provided, the existing
     * configuration's setting is not modified.
     */
    enabled?: boolean;

    /**
     * The OIDC provider's updated client ID. If not provided, the existing
     * configuration's value is not modified.
     */
    clientId?: string;

    /**
     * The OIDC provider's updated issuer. If not provided, the existing
     * configuration's value is not modified.
     */
    issuer?: string;
  }

  /**
   * The response interface for listing provider configs. This is only available
   * when listing all identity providers' configurations via
   * {@link https://firebase.google.com/docs/reference/admin/node/admin.auth.Auth#listProviderConfigs `listProviderConfigs()`}.
   */
  interface ListProviderConfigResults {
    /**
     * The list of providers for the specified type in the current page.
     */
    providerConfigs: admin.auth.AuthProviderConfig[];

    /**
     * The next page token, if available.
     */
    pageToken?: string;
  }

  type UpdateAuthProviderRequest =
    | admin.auth.SAMLUpdateAuthProviderRequest
    | admin.auth.OIDCUpdateAuthProviderRequest;

  interface BaseAuth {
    /**
     * Creates a new Firebase custom token (JWT) that can be sent back to a client
     * device to use to sign in with the client SDKs' `signInWithCustomToken()`
     * methods. (Tenant-aware instances will also embed the tenant ID in the
     * token.)
     *
     * See [Create Custom Tokens](/docs/auth/admin/create-custom-tokens) for code
     * samples and detailed documentation.
     *
     * @param uid The `uid` to use as the custom token's subject.
     * @param developerClaims Optional additional claims to include
     *   in the custom token's payload.
     *
     * @return A promise fulfilled with a custom token for the
     *   provided `uid` and payload.
     */
    createCustomToken(uid: string, developerClaims?: Object): Promise<string>;

    /**
     * Creates a new user.
     *
     * See [Create a user](/docs/auth/admin/manage-users#create_a_user) for code
     * samples and detailed documentation.
     *
     * @param properties The properties to set on the
     *   new user record to be created.
     *
     * @return A promise fulfilled with the user
     *   data corresponding to the newly created user.
     */
    createUser(
      properties: admin.auth.CreateRequest
    ): Promise<admin.auth.UserRecord>;

    /**
     * Deletes an existing user.
     *
     * See [Delete a user](/docs/auth/admin/manage-users#delete_a_user) for code
     * samples and detailed documentation.
     *
     * @param uid The `uid` corresponding to the user to delete.
     *
     * @return An empty promise fulfilled once the user has been
     *   deleted.
     */
    deleteUser(uid: string): Promise<void>;

    /**
     * Gets the user data for the user corresponding to a given `uid`.
     *
     * See [Retrieve user data](/docs/auth/admin/manage-users#retrieve_user_data)
     * for code samples and detailed documentation.
     *
     * @param uid The `uid` corresponding to the user whose data to fetch.
     *
     * @return A promise fulfilled with the user
     *   data corresponding to the provided `uid`.
     */
    getUser(uid: string): Promise<admin.auth.UserRecord>;

    /**
     * Gets the user data for the user corresponding to a given email.
     *
     * See [Retrieve user data](/docs/auth/admin/manage-users#retrieve_user_data)
     * for code samples and detailed documentation.
     *
     * @param email The email corresponding to the user whose data to
     *   fetch.
     *
     * @return A promise fulfilled with the user
     *   data corresponding to the provided email.
     */
    getUserByEmail(email: string): Promise<admin.auth.UserRecord>;

    /**
     * Gets the user data for the user corresponding to a given phone number. The
     * phone number has to conform to the E.164 specification.
     *
     * See [Retrieve user data](/docs/auth/admin/manage-users#retrieve_user_data)
     * for code samples and detailed documentation.
     *
     * @param phoneNumber The phone number corresponding to the user whose
     *   data to fetch.
     *
     * @return A promise fulfilled with the user
     *   data corresponding to the provided phone number.
     */
    getUserByPhoneNumber(phoneNumber: string): Promise<admin.auth.UserRecord>;

    /**
     * Retrieves a list of users (single batch only) with a size of `maxResults`
     * starting from the offset as specified by `pageToken`. This is used to
     * retrieve all the users of a specified project in batches.
     *
     * See [List all users](/docs/auth/admin/manage-users#list_all_users)
     * for code samples and detailed documentation.
     *
     * @param maxResults The page size, 1000 if undefined. This is also
     *   the maximum allowed limit.
     * @param pageToken The next page token. If not specified, returns
     *   users starting without any offset.
     * @return A promise that resolves with
     *   the current batch of downloaded users and the next page token.
     */
    listUsers(
      maxResults?: number,
      pageToken?: string
    ): Promise<admin.auth.ListUsersResult>;

    /**
     * Updates an existing user.
     *
     * See [Update a user](/docs/auth/admin/manage-users#update_a_user) for code
     * samples and detailed documentation.
     *
     * @param uid The `uid` corresponding to the user to delete.
     * @param properties The properties to update on
     *   the provided user.
     *
     * @return A promise fulfilled with the
     *   updated user data.
     */
    updateUser(
      uid: string,
      properties: admin.auth.UpdateRequest
    ): Promise<admin.auth.UserRecord>;

    /**
     * Verifies a Firebase ID token (JWT). If the token is valid, the promise is
     * fulfilled with the token's decoded claims; otherwise, the promise is
     * rejected.
     * An optional flag can be passed to additionally check whether the ID token
     * was revoked.
     *
     * See [Verify ID Tokens](/docs/auth/admin/verify-id-tokens) for code samples
     * and detailed documentation.
     *
     * @param idToken The ID token to verify.
     * @param checkRevoked Whether to check if the ID token was revoked.
     *   This requires an extra request to the Firebase Auth backend to check
     *   the `tokensValidAfterTime` time for the corresponding user.
     *   When not specified, this additional check is not applied.
     *
     * @return A promise fulfilled with the
     *   token's decoded claims if the ID token is valid; otherwise, a rejected
     *   promise.
     */
    verifyIdToken(
      idToken: string,
      checkRevoked?: boolean
    ): Promise<admin.auth.DecodedIdToken>;

    /**
     * Sets additional developer claims on an existing user identified by the
     * provided `uid`, typically used to define user roles and levels of
     * access. These claims should propagate to all devices where the user is
     * already signed in (after token expiration or when token refresh is forced)
     * and the next time the user signs in. If a reserved OIDC claim name
     * is used (sub, iat, iss, etc), an error is thrown. They are set on the
     * authenticated user's ID token JWT.
     *
     * See
     * [Defining user roles and access levels](/docs/auth/admin/custom-claims)
     * for code samples and detailed documentation.
     *
     * @param uid The `uid` of the user to edit.
     * @param customUserClaims The developer claims to set. If null is
     *   passed, existing custom claims are deleted. Passing a custom claims payload
     *   larger than 1000 bytes will throw an error. Custom claims are added to the
     *   user's ID token which is transmitted on every authenticated request.
     *   For profile non-access related user attributes, use database or other
     *   separate storage systems.
     * @return A promise that resolves when the operation completes
     *   successfully.
     */
    setCustomUserClaims(
      uid: string,
      customUserClaims: Object | null
    ): Promise<void>;

    /**
     * Revokes all refresh tokens for an existing user.
     *
     * This API will update the user's
     * {@link admin.auth.UserRecord#tokensValidAfterTime `tokensValidAfterTime`} to
     * the current UTC. It is important that the server on which this is called has
     * its clock set correctly and synchronized.
     *
     * While this will revoke all sessions for a specified user and disable any
     * new ID tokens for existing sessions from getting minted, existing ID tokens
     * may remain active until their natural expiration (one hour). To verify that
     * ID tokens are revoked, use
     * {@link admin.auth.Auth#verifyIdToken `verifyIdToken(idToken, true)`}
     * where `checkRevoked` is set to true.
     *
     * @param uid The `uid` corresponding to the user whose refresh tokens
     *   are to be revoked.
     *
     * @return An empty promise fulfilled once the user's refresh
     *   tokens have been revoked.
     */
    revokeRefreshTokens(uid: string): Promise<void>;

    /**
     * Imports the provided list of users into Firebase Auth.
     * A maximum of 1000 users are allowed to be imported one at a time.
     * When importing users with passwords,
     * {@link admin.auth.UserImportOptions `UserImportOptions`} are required to be
     * specified.
     * This operation is optimized for bulk imports and will ignore checks on `uid`,
     * `email` and other identifier uniqueness which could result in duplications.
     *
     * @param users The list of user records to import to Firebase Auth.
     * @param options The user import options, required when the users provided include
     *   password credentials.
     * @return A promise that resolves when
     *   the operation completes with the result of the import. This includes the
     *   number of successful imports, the number of failed imports and their
     *   corresponding errors.
     */
    importUsers(
      users: admin.auth.UserImportRecord[],
      options?: admin.auth.UserImportOptions
    ): Promise<admin.auth.UserImportResult>;

    /**
     * Creates a new Firebase session cookie with the specified options. The created
     * JWT string can be set as a server-side session cookie with a custom cookie
     * policy, and be used for session management. The session cookie JWT will have
     * the same payload claims as the provided ID token.
     *
     * See [Manage Session Cookies](/docs/auth/admin/manage-cookies) for code
     * samples and detailed documentation.
     *
     * @param idToken The Firebase ID token to exchange for a session
     *   cookie.
     * @param sessionCookieOptions The session
     *   cookie options which includes custom session duration.
     *
     * @return A promise that resolves on success with the
     *   created session cookie.
     */
    createSessionCookie(
      idToken: string,
      sessionCookieOptions: admin.auth.SessionCookieOptions
    ): Promise<string>;

    /**
     * Verifies a Firebase session cookie. Returns a Promise with the cookie claims.
     * Rejects the promise if the cookie could not be verified. If `checkRevoked` is
     * set to true, verifies if the session corresponding to the session cookie was
     * revoked. If the corresponding user's session was revoked, an
     * `auth/session-cookie-revoked` error is thrown. If not specified the check is
     * not performed.
     *
     * See [Verify Session Cookies](/docs/auth/admin/manage-cookies#verify_session_cookie_and_check_permissions)
     * for code samples and detailed documentation
     *
     * @param sessionCookie The session cookie to verify.
     * @param checkForRevocation  Whether to check if the session cookie was
     *   revoked. This requires an extra request to the Firebase Auth backend to
     *   check the `tokensValidAfterTime` time for the corresponding user.
     *   When not specified, this additional check is not performed.
     *
     * @return A promise fulfilled with the
     *   session cookie's decoded claims if the session cookie is valid; otherwise,
     *   a rejected promise.
     */
    verifySessionCookie(
      sessionCookie: string,
      checkForRevocation?: boolean
    ): Promise<admin.auth.DecodedIdToken>;

    /**
     * Generates the out of band email action link to reset a user's password.
     * The link is generated for the user with the specified email address. The
     * optional  {@link admin.auth.ActionCodeSettings `ActionCodeSettings`} object
     * defines whether the link is to be handled by a mobile app or browser and the
     * additional state information to be passed in the deep link, etc.
     *
     * @example
     * ```javascript
     * var actionCodeSettings = {
     *   url: 'https://www.example.com/?email=user@example.com',
     *   iOS: {
     *     bundleId: 'com.example.ios'
     *   },
     *   android: {
     *     packageName: 'com.example.android',
     *     installApp: true,
     *     minimumVersion: '12'
     *   },
     *   handleCodeInApp: true,
     *   dynamicLinkDomain: 'custom.page.link'
     * };
     * admin.auth()
     *     .generatePasswordResetLink('user@example.com', actionCodeSettings)
     *     .then(function(link) {
     *       // The link was successfully generated.
     *     })
     *     .catch(function(error) {
     *       // Some error occurred, you can inspect the code: error.code
     *     });
     * ```
     *
     * @param email The email address of the user whose password is to be
     *   reset.
     * @param actionCodeSettings The action
     *     code settings. If specified, the state/continue URL is set as the
     *     "continueUrl" parameter in the password reset link. The default password
     *     reset landing page will use this to display a link to go back to the app
     *     if it is installed.
     *     If the actionCodeSettings is not specified, no URL is appended to the
     *     action URL.
     *     The state URL provided must belong to a domain that is whitelisted by the
     *     developer in the console. Otherwise an error is thrown.
     *     Mobile app redirects are only applicable if the developer configures
     *     and accepts the Firebase Dynamic Links terms of service.
     *     The Android package name and iOS bundle ID are respected only if they
     *     are configured in the same Firebase Auth project.
     * @return A promise that resolves with the generated link.
     */
    generatePasswordResetLink(
      email: string,
      actionCodeSettings?: admin.auth.ActionCodeSettings
    ): Promise<string>;

    /**
     * Generates the out of band email action link to verify the user's ownership
     * of the specified email. The
     * {@link admin.auth.ActionCodeSettings `ActionCodeSettings`} object provided
     * as an argument to this method defines whether the link is to be handled by a
     * mobile app or browser along with additional state information to be passed in
     * the deep link, etc.
     *
     * @example
     * ```javascript
     * var actionCodeSettings = {
     *   url: 'https://www.example.com/cart?email=user@example.com&cartId=123',
     *   iOS: {
     *     bundleId: 'com.example.ios'
     *   },
     *   android: {
     *     packageName: 'com.example.android',
     *     installApp: true,
     *     minimumVersion: '12'
     *   },
     *   handleCodeInApp: true,
     *   dynamicLinkDomain: 'custom.page.link'
     * };
     * admin.auth()
     *     .generateEmailVerificationLink('user@example.com', actionCodeSettings)
     *     .then(function(link) {
     *       // The link was successfully generated.
     *     })
     *     .catch(function(error) {
     *       // Some error occurred, you can inspect the code: error.code
     *     });
     * ```
     *
     * @param email The email account to verify.
     * @param actionCodeSettings The action
     *     code settings. If specified, the state/continue URL is set as the
     *     "continueUrl" parameter in the email verification link. The default email
     *     verification landing page will use this to display a link to go back to
     *     the app if it is installed.
     *     If the actionCodeSettings is not specified, no URL is appended to the
     *     action URL.
     *     The state URL provided must belong to a domain that is whitelisted by the
     *     developer in the console. Otherwise an error is thrown.
     *     Mobile app redirects are only applicable if the developer configures
     *     and accepts the Firebase Dynamic Links terms of service.
     *     The Android package name and iOS bundle ID are respected only if they
     *     are configured in the same Firebase Auth project.
     * @return A promise that resolves with the generated link.
     */
    generateEmailVerificationLink(
      email: string,
      actionCodeSettings?: admin.auth.ActionCodeSettings
    ): Promise<string>;

    /**
     * Generates the out of band email action link to sign in or sign up the owner
     * of the specified email. The
     * {@link admin.auth.ActionCodeSettings `ActionCodeSettings`} object provided
     * as an argument to this method defines whether the link is to be handled by a
     * mobile app or browser along with additional state information to be passed in
     * the deep link, etc.
     *
     * @example
     * ```javascript
     * var actionCodeSettings = {
     *   // The URL to redirect to for sign-in completion. This is also the deep
     *   // link for mobile redirects. The domain (www.example.com) for this URL
     *   // must be whitelisted in the Firebase Console.
     *   url: 'https://www.example.com/finishSignUp?cartId=1234',
     *   iOS: {
     *     bundleId: 'com.example.ios'
     *   },
     *   android: {
     *     packageName: 'com.example.android',
     *     installApp: true,
     *     minimumVersion: '12'
     *   },
     *   // This must be true.
     *   handleCodeInApp: true,
     *   dynamicLinkDomain: 'custom.page.link'
     * };
     * admin.auth()
     *     .generateSignInWithEmailLink('user@example.com', actionCodeSettings)
     *     .then(function(link) {
     *       // The link was successfully generated.
     *     })
     *     .catch(function(error) {
     *       // Some error occurred, you can inspect the code: error.code
     *     });
     * ```
     *
     * @param email The email account to sign in with.
     * @param actionCodeSettings The action
     *     code settings. These settings provide Firebase with instructions on how
     *     to construct the email link. This includes the sign in completion URL or
     *     the deep link for redirects and the mobile apps to use when the
     *     sign-in link is opened on an Android or iOS device.
     *     Mobile app redirects are only applicable if the developer configures
     *     and accepts the Firebase Dynamic Links terms of service.
     *     The Android package name and iOS bundle ID are respected only if they
     *     are configured in the same Firebase Auth project.
     * @return A promise that resolves with the generated link.
     */
    generateSignInWithEmailLink(
      email: string,
      actionCodeSettings: admin.auth.ActionCodeSettings
    ): Promise<string>;

    /**
     * Returns the list of existing provider configurations matching the filter
     * provided. At most, 100 provider configs can be listed at a time.
     *
     * SAML and OIDC provider support requires Google Cloud's Identity Platform
     * (GCIP). To learn more about GCIP, including pricing and features,
     * see the [GCIP documentation](https://cloud.google.com/identity-platform).
     *
     * @param options The provider config filter to apply.
     * @return A promise that resolves with the list of provider configs meeting the
     *   filter requirements.
     */
    listProviderConfigs(
      options: admin.auth.AuthProviderConfigFilter
    ): Promise<admin.auth.ListProviderConfigResults>;

    /**
     * Looks up an Auth provider configuration by the provided ID.
     * Returns a promise that resolves with the provider configuration
     * corresponding to the provider ID specified. If the specified ID does not
     * exist, an `auth/configuration-not-found` error is thrown.
     *
     * SAML and OIDC provider support requires Google Cloud's Identity Platform
     * (GCIP). To learn more about GCIP, including pricing and features,
     * see the [GCIP documentation](https://cloud.google.com/identity-platform).
     *
     * @param providerId The provider ID corresponding to the provider
     *     config to return.
     * @return A promise that resolves
     *     with the configuration corresponding to the provided ID.
     */
    getProviderConfig(
      providerId: string
    ): Promise<admin.auth.AuthProviderConfig>;

    /**
     * Deletes the provider configuration corresponding to the provider ID passed.
     * If the specified ID does not exist, an `auth/configuration-not-found` error
     * is thrown.
     *
     * SAML and OIDC provider support requires Google Cloud's Identity Platform
     * (GCIP). To learn more about GCIP, including pricing and features,
     * see the [GCIP documentation](https://cloud.google.com/identity-platform).
     *
     * @param providerId The provider ID corresponding to the provider
     *     config to delete.
     * @return A promise that resolves on completion.
     */
    deleteProviderConfig(providerId: string): Promise<void>;

    /**
     * Returns a promise that resolves with the updated `AuthProviderConfig`
     * corresponding to the provider ID specified.
     * If the specified ID does not exist, an `auth/configuration-not-found` error
     * is thrown.
     *
     * SAML and OIDC provider support requires Google Cloud's Identity Platform
     * (GCIP). To learn more about GCIP, including pricing and features,
     * see the [GCIP documentation](https://cloud.google.com/identity-platform).
     *
     * @param providerId The provider ID corresponding to the provider
     *     config to update.
     * @param updatedConfig The updated configuration.
     * @return A promise that resolves with the updated provider configuration.
     */
    updateProviderConfig(
      providerId: string,
      updatedConfig: admin.auth.UpdateAuthProviderRequest
    ): Promise<admin.auth.AuthProviderConfig>;

    /**
     * Returns a promise that resolves with the newly created `AuthProviderConfig`
     * when the new provider configuration is created.
     *
     * SAML and OIDC provider support requires Google Cloud's Identity Platform
     * (GCIP). To learn more about GCIP, including pricing and features,
     * see the [GCIP documentation](https://cloud.google.com/identity-platform).
     *
     * @param config The provider configuration to create.
     * @return A promise that resolves with the created provider configuration.
     */
    createProviderConfig(
      config: admin.auth.AuthProviderConfig
    ): Promise<admin.auth.AuthProviderConfig>;
  }

  /**
   * Tenant-aware `Auth` interface used for managing users, configuring SAML/OIDC providers,
   * generating email links for password reset, email verification, etc for specific tenants.
   *
   * Multi-tenancy support requires Google Cloud's Identity Platform
   * (GCIP). To learn more about GCIP, including pricing and features,
   * see the [GCIP documentation](https://cloud.google.com/identity-platform)
   *
   * Each tenant contains its own identity providers, settings and sets of users.
   * Using `TenantAwareAuth`, users for a specific tenant and corresponding OIDC/SAML
   * configurations can also be managed, ID tokens for users signed in to a specific tenant
   * can be verified, and email action links can also be generated for users belonging to the
   * tenant.
   *
   * `TenantAwareAuth` instances for a specific `tenantId` can be instantiated by calling
   * `auth.tenantManager().authForTenant(tenantId)`.
   */
  interface TenantAwareAuth extends BaseAuth {
    /**
     * The tenant identifier corresponding to this `TenantAwareAuth` instance.
     * All calls to the user management APIs, OIDC/SAML provider management APIs, email link
     * generation APIs, etc will only be applied within the scope of this tenant.
     */
    tenantId: string;
  }

  interface Auth extends admin.auth.BaseAuth {
    /**
     * @return The tenant manager instance associated with the current project.
     */
    tenantManager(): admin.auth.TenantManager;
  }

  /**
   * Defines the tenant manager used to help manage tenant related operations.
   * This includes:
   * <ul>
   * <li>The ability to create, update, list, get and delete tenants for the underlying
   *     project.</li>
   * <li>Getting a `TenantAwareAuth` instance for running Auth related operations
   *     (user management, provider configuration management, token verification,
   *     email link generation, etc) in the context of a specified tenant.</li>
   * </ul>
   */
  interface TenantManager {
    /**
     * @param tenantId The tenant ID whose `TenantAwareAuth` instance is to be returned.
     *
     * @return The `TenantAwareAuth` instance corresponding to this tenant identifier.
     */
    authForTenant(tenantId: string): admin.auth.TenantAwareAuth;

    /**
     * Gets the tenant configuration for the tenant corresponding to a given `tenantId`.
     *
     * @param tenantId The tenant identifier corresponding to the tenant whose data to fetch.
     *
     * @return A promise fulfilled with the tenant configuration to the provided `tenantId`.
     */
    getTenant(tenantId: string): Promise<admin.auth.Tenant>;

    /**
     * Retrieves a list of tenants (single batch only) with a size of `maxResults`
     * starting from the offset as specified by `pageToken`. This is used to
     * retrieve all the tenants of a specified project in batches.
     *
     * @param maxResults The page size, 1000 if undefined. This is also
     *   the maximum allowed limit.
     * @param pageToken The next page token. If not specified, returns
     *   tenants starting without any offset.
     *
     * @return A promise that resolves with
     *   a batch of downloaded tenants and the next page token.
     */
    listTenants(
      maxResults?: number,
      pageToken?: string
    ): Promise<admin.auth.ListTenantsResult>;

    /**
     * Deletes an existing tenant.
     *
     * @param tenantId The `tenantId` corresponding to the tenant to delete.
     *
     * @return An empty promise fulfilled once the tenant has been deleted.
     */
    deleteTenant(tenantId: string): Promise<void>;

    /**
     * Creates a new tenant.
     * When creating new tenants, tenants that use separate billing and quota will require their
     * own project and must be defined as `full_service`.
     *
     * @param tenantOptions The properties to set on the new tenant configuration to be created.
     *
     * @return A promise fulfilled with the tenant configuration corresponding to the newly
     *   created tenant.
     */
    createTenant(
      tenantOptions: admin.auth.CreateTenantRequest
    ): Promise<admin.auth.Tenant>;

    /**
     * Updates an existing tenant configuration.
     *
     * @param tenantId The `tenantId` corresponding to the tenant to delete.
     * @param tenantOptions The properties to update on the provided tenant.
     *
     * @return A promise fulfilled with the update tenant data.
     */
    updateTenant(
      tenantId: string,
      tenantOptions: admin.auth.UpdateTenantRequest
    ): Promise<admin.auth.Tenant>;
  }
}
