import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    // Explicitly setting mainFields to default value. For some reason, Vitest isn't
    // respecting the 'module' field in package.json without specifying it explicitly
    mainFields: ["module", "jsnext:main", "jsnext"],
    alias: {
      path: "rollup-plugin-node-polyfills/polyfills/path",
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          "jotai/babel/plugin-react-refresh",
          "jotai/babel/plugin-debug-label",
        ],
      },
      include: "**/*.tsx",
    }),
    // To enable import '@src/' type of imports
    viteTsconfigPaths(),
    // To enable import of SVG as React component
    svgrPlugin(),
  ],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "src/test/setupTests.ts",
    deps: {
      // According to vitest, clsx exports ES Module code in a CommonJS package.
      // This fixes it.
      inline: ["clsx"],
    },
  },
});
