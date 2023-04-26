import React from "react";
import type { Preview } from "@storybook/react";
import RowyThemeProvider from "../src/theme/RowyThemeProvider";
import { themes } from "@storybook/theming";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      theme: themes.dark,
    },
  },

  decorators: [
    (Story) => (
      <RowyThemeProvider>
        <Story />
      </RowyThemeProvider>
    ),
  ],
};

export default preview;
