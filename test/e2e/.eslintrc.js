module.exports = {
  rules: {
    "testing-library/prefer-screen-queries": "off",
    "no-relative-import-paths/no-relative-import-paths": "off",
  },
  env: {
    jest: true,
  },
  globals: {
    page: true,
    browser: true,
    context: true,
    puppeteerConfig: true,
    jestPuppeteer: true,
  },
};
