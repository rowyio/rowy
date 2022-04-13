const { whenProd } = require("@craco/craco");
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
    // Use swc on production only since Jotai doesn’t have swc plugins yet
    // See https://github.com/pmndrs/jotai/discussions/1057
    ...whenProd(
      () => [
        {
          plugin: CracoSwcPlugin,
          options: {
            swcLoaderOptions: {
              jsc: {
                target: "es2021",
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
      []
    ),
  ],
  babel: {
    plugins: ["jotai/babel/plugin-debug-label"],
  },
};
