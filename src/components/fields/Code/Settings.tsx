import { ISettingsProps } from "@src/components/fields/types";
import MultiSelect from "@rowy/multiselect";

const languages = [
  "javascript",
  "typescript",
  "json",
  "html",
  "css",
  "scss",
  "shell",
  "yaml",
  "xml",
  "ruby",
  "python",
  "php",
  "markdown",
  "rust",
  "csharp",
  "cpp",
  "c",
  "java",
  "go",
  "plaintext",
];
export default function Settings({ config, onChange }: ISettingsProps) {
  return (
    <MultiSelect
      searchable
      multiple={false}
      options={languages}
      value={config.language ?? "javascript"}
      onChange={(value) => {
        onChange("language")(value);
      }}
      label="Language"
    />
  );
}
