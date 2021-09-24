const CracoAlias = require("craco-alias");
const CracoSwcPlugin = require("craco-swc");

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        baseUrl: "./src",
        tsConfigPath: "./tsconfig.extend.json",
      },
    },
    {
      plugin: CracoSwcPlugin,
      options: {
        swcLoaderOptions: {
          jsc: {
            target: "es2019",
            transform: {
              react: {
                runtime: "automatic",
              },
            },
          },
        },
      },
    },
  ],
};
