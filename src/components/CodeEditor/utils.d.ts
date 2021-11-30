/**
 * utility functions
 */
declare namespace utilFns {
  /**
   * Sends out an email through sendGrid
   */
  function sendEmail(msg: {
    from: string;
    templateId: string;
    personalizations: { to: string; dynamic_template_data: any }[];
  }): void {}

  /**
   * Gets the secret defined in Google Cloud Secret
   */
  async function getSecret(name: string, v?: string): any {}

  /**
   * Async version of forEach
   */
  async function asyncForEach(array: any[], callback: Function): void {}

  /**
   * Generate random ID from numbers and English characters including lowercase and uppercase
   */
  function generateId(): string {}

  /**
   * Add an item to an array field
   */
  function arrayUnion(val: string): void {}

  /**
   * Remove an item to an array field
   */
  function arrayRemove(val: string): void {}

  /**
   * Increment a number field
   */
  function increment(val: number): void {}

  function hasRequiredFields(requiredFields: string[], data: any): boolean {}

  function hasAnyRole(
    authorizedRoles: string[],
    context: functions.https.CallableContext
  ): boolean {}
}
