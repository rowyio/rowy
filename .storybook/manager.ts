// .storybook/manager.js

import { addons } from "@storybook/manager-api";
import { themes, create } from "@storybook/theming";

// export default create({
//   base: "light",
//   brandTitle: "Rowy Storybook",
//   brandUrl: "https://rowy.io",
//   brandImage:
//     "https://uploads-ssl.webflow.com/611c806ecaa429d0993c1e0f/6295e57a8ee2ff6b49e577d1_horizontal%20on%20dark.png",
//   brandTarget: "_self",
// });

addons.setConfig({
  isFullscreen: false,
  showNav: true,
  showPanel: true,
  panelPosition: "bottom",
  enableShortcuts: true,
  showToolbar: true,
  theme: create({
    base: "dark",
    brandTitle: "Rowy book",
    brandUrl: "https://rowy.io",
    brandImage:
      "https://uploads-ssl.webflow.com/611c806ecaa429d0993c1e0f/6295e57a8ee2ff6b49e577d1_horizontal%20on%20dark.png",
    brandTarget: "_self",
  }),
  selectedPanel: undefined,
  initialActive: "sidebar",
  sidebar: {
    showRoots: false,
    collapsedRoots: ["other"],
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
});
