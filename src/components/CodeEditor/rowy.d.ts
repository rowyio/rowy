/**
 * utility functions
 */
declare namespace rowy {
  /**
   * uploads a file to the cloud storage from a url
   */
  function url2storage(
    url: string,
    storagePath: string,
    fileName?: string
  ): Promise<{
    downloadURL: string;
    name: string;
    type: string;
    lastModifiedTS: Date;
  }>;

  /**
   * Gets the secret defined in Google Cloud Secret
   */
  async function getSecret(name: string, v?: string): Promise<string | null>;

  async function getServiceAccountUser(): Promise<{
    email: string;
    emailVerified: boolean;
    displayName: string;
    photoURL: string;
    uid: string;
    timestamp: number;
  }>;
}
