import { ISettingsProps } from "@src/components/fields/types";

export default function Settings({ onChange, config }: ISettingsProps) {
  return (
    <>
      {`Config: ${JSON.stringify(config)}`}
      <button onClick={() => onChange("foo")("bar")} />
    </>
  );
}
