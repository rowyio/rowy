const { whenDev } = require("@craco/craco");
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
    // Use Babel on dev since Jotai doesn’t have swc plugins yet
    // See https://github.com/pmndrs/jotai/discussions/1057
    // Use swc on production and test since Babel seems to break Jest
    ...whenDev(
      () => [],
      [
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
      ]
    ),
  ],
  babel: {
    plugins: [
      "jotai/babel/plugin-debug-label",
      "./node_modules/jotai/babel/plugin-react-refresh",
    ],
  },
  jest: {
    configure: (jestConfig) => {
      jestConfig.setupFilesAfterEnv = ["./src/test/setupTests.ts"];
      jestConfig.forceExit = true; // jest hangs if we don't have this

      jestConfig.moduleNameMapper["lodash-es"] = "lodash";
      jestConfig.moduleNameMapper["^.+\\.(css|less)$"] =
        "<rootDir>/src/test/importStub.js";
      jestConfig.moduleNameMapper["^!!raw-loader!.*"] =
        "<rootDir>/src/test/importStub.js";

      jestConfig.extensionsToTreatAsEsm = [".ts", ".tsx"];
      // Need to transform node modules to prevent
      // "cannot use import outside module" error
      jestConfig.transformIgnorePatterns = [
        // "/node_modules/",
        "\\.pnp\\.[^\\/]+$",
      ];

      return jestConfig;
    },
  },
  webpack: {
    configure: {
      resolve: {
        // Polyfill for monaco-editor-auto-typings
        fallback: {
          path: require.resolve("path-browserify"),
          // stream: require.resolve("stream-browserify"),
          // buffer: require.resolve("buffer"),
        },
      },
    },
  },
};
