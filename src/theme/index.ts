import { extend } from "colord";
import mixPlugin from "colord/plugins/mix";
import lchPlugin from "colord/plugins/lch";
import a11yPlugin from "colord/plugins/a11y";
extend([mixPlugin, lchPlugin, a11yPlugin]);

export * from "./themes";
export { default } from "./themes";
