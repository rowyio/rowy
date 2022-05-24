/** Function settings stored in project _rowy_/functions */
export type FunctionSettings = {
  id: string;
  name: string;
  editorRoles: string[];
  executorRoles: string[];
  functionType: "utility" | "task" | "rest" | "webhook";
};

/** Function schema document loaded when function or function settings dialog is open */
export type FunctionSchema = {
  code: string;
  dependencies?: Record<string, ColumnConfig>;
};
