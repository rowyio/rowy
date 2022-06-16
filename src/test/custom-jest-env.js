/**
 * From FirebaseExtended/reactfire
 * https://github.com/FirebaseExtended/reactfire/blob/823eaa2e66098a9c68909aa6676932e3422dc6bf/test/custom-jest-environment.js
 *
 * Copyright (c) 2016 Firebase, MIT License
 */

/**
 * Correct Jest bug that prevents the Firestore tests from running. More info here:
 * https://github.com/firebase/firebase-js-sdk/issues/3096#issuecomment-637584185
 */
import "regenerator-runtime/runtime";
const BrowserEnvironment = require("jest-environment-jsdom");

class MyEnvironment extends BrowserEnvironment {
  constructor(config) {
    super(
      Object.assign({}, config, {
        globals: Object.assign({}, config.globals, {
          Uint32Array: Uint32Array,
          Uint8Array: Uint8Array,
          ArrayBuffer: ArrayBuffer,
        }),
      })
    );
  }

  async setup() {}

  async teardown() {}
}

module.exports = MyEnvironment;
